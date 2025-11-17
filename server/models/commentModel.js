const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please enter some content'],
      trim: true,
      maxlength: [2000, 'A comment must have less or equal to 2000 characters'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A comment must have an user'],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'A comment must belong to a post'],
      index: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null, // null = top-level comment, otherwise it's a reply
    },
    level: {
      type: Number,
      default: 0, // 0 = top-level, 1+ = nested reply depth
      min: 0,
      max: 10, // Limit nesting depth to prevent excessive recursion
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    repliesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false, // Soft delete to maintain thread structure
    },
    deletedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1, createdAt: -1 });
commentSchema.index({ user: 1 });
commentSchema.index({ post: 1, parentComment: 1, createdAt: -1 });
commentSchema.index({ post: 1, level: 1, createdAt: -1 });

// Virtual populate for replies
commentSchema.virtual('replies', {
  ref: 'Comment',
  foreignField: 'parentComment',
  localField: '_id',
});

// Track if document is new before saving (for post-save middleware)
commentSchema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
});

// pre save to update updatedAt and set isEdited flag
commentSchema.pre('save', function (next) {
  if (!this.isNew && this.isModified('content')) {
    this.updatedAt = Date.now();
    this.isEdited = true;
  }
  next();
});

// Middleware to handle soft delete
commentSchema.pre('save', function (next) {
  if (this.isModified('isDeleted') && this.isDeleted) {
    this.deletedAt = Date.now();
  }
  next();
});

// Query middleware to populate user and hide deleted content
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'username fullName avatar',
  });
  next();
});

// Increment replies count
commentSchema.statics.incrementRepliesCount = async function (commentId) {
  await this.findByIdAndUpdate(commentId, {
    $inc: { repliesCount: 1 },
  });
};

// Decrement replies count
commentSchema.statics.decrementRepliesCount = async function (commentId) {
  await this.findByIdAndUpdate(commentId, {
    $inc: { repliesCount: -1 },
  });
};

// Increment post comments count
commentSchema.statics.incrementPostCommentsCount = async function (postId) {
  const Post = mongoose.model('Post');
  await Post.findByIdAndUpdate(postId, {
    $inc: { commentsCount: 1 },
  });
};

// Decrement post comments count
commentSchema.statics.decrementPostCommentsCount = async function (postId) {
  const Post = mongoose.model('Post');
  await Post.findByIdAndUpdate(postId, {
    $inc: { commentsCount: -1 },
  });
};

// Post-save middleware to update parent comment and post counts
commentSchema.post('save', async function (doc) {
  if (doc.wasNew && !doc.isDeleted) {
    // Increment parent comment replies count
    if (doc.parentComment) {
      await this.constructor.incrementRepliesCount(doc.parentComment);
    }
    // Increment post comments count
    await this.constructor.incrementPostCommentsCount(doc.post);
  }
});

// Instance method to soft delete with cascade
commentSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = Date.now();
  await this.save();

  // Decrement post comments count for this comment
  await this.constructor.decrementPostCommentsCount(this.post);

  // Decrement parent comment's replies count if this is a nested reply
  if (this.parentComment) {
    await this.constructor.decrementRepliesCount(this.parentComment);
  }

  // Count nested replies before deleting them
  const nestedRepliesCount = await this.constructor.countDocuments({
    parentComment: this._id,
    isDeleted: false,
  });

  // Soft delete all nested replies
  if (nestedRepliesCount > 0) {
    await this.constructor.updateMany(
      { parentComment: this._id, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          deletedAt: Date.now(),
        },
      },
    );

    // Decrement post comments count for all nested replies
    for (let i = 0; i < nestedRepliesCount; i++) {
      await this.constructor.decrementPostCommentsCount(this.post);
    }
  }
};

// Static method to add isLiked field for a specific user
commentSchema.statics.addIsLikedField = async function (comments, userId) {
  if (!userId || !comments) return comments;

  const Like = mongoose.model('Like');
  const isArray = Array.isArray(comments);
  const commentsArray = isArray ? comments : [comments];

  if (commentsArray.length === 0) return comments;

  // Recursively collect all comment IDs including nested replies
  const collectCommentIds = (commentsList) => {
    const ids = [];
    commentsList.forEach((comment) => {
      ids.push(comment._id);
      if (comment.replies && comment.replies.length > 0) {
        ids.push(...collectCommentIds(comment.replies));
      }
    });
    return ids;
  };

  const commentIds = collectCommentIds(commentsArray);

  // Find all likes by this user for these comments in a single query
  const likes = await Like.find({
    user: userId,
    contentType: 'Comment',
    contentId: { $in: commentIds },
  }).select('contentId');

  // Create a Set of liked comment IDs for O(1) lookup
  const likedCommentIds = new Set(
    likes.map((like) => like.contentId.toString()),
  );

  // Recursively add isLiked field to comments and their replies
  const addIsLikedToComments = (commentsList) => {
    commentsList.forEach((comment) => {
      const isLiked = likedCommentIds.has(comment._id.toString());
      // Use set() with strict: false to ensure the field is serialized
      comment.set('isLiked', isLiked, { strict: false });

      // Process nested replies
      if (comment.replies && comment.replies.length > 0) {
        addIsLikedToComments(comment.replies);
      }
    });
  };

  addIsLikedToComments(commentsArray);

  return comments;
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
