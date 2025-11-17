const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A like must belong to a user'],
    },
    contentType: {
      type: String,
      required: [true, 'Content type is required'],
      enum: ['Post', 'Comment'],
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Content ID is required'],
      refPath: 'contentType',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// 1 like per content type
likeSchema.index({ user: 1, contentType: 1, contentId: 1 }, { unique: true });

likeSchema.index({ contentType: 1, contentId: 1 });
likeSchema.index({ user: 1 });
// likeSchema.index({ contentId: 1 });

// Query middleware to populate user details
likeSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'username fullName avatar',
  });
  next();
});

// Increment likes count
likeSchema.statics.incrementLikesCount = async function (
  contentType,
  contentId,
) {
  const Model = mongoose.model(contentType);
  await Model.findByIdAndUpdate(contentId, {
    $inc: { likesCount: 1 },
  });
};

// TODO: fix double decrement
// Decrement likes count
likeSchema.statics.decrementLikesCount = async function (
  contentType,
  contentId,
) {
  const Model = mongoose.model(contentType);
  await Model.findByIdAndUpdate(contentId, {
    $inc: { likesCount: -1 },
  });
};

// Post-save to increment likes count
likeSchema.post('save', async function (doc) {
  await this.constructor.incrementLikesCount(doc.contentType, doc.contentId);
});

// Post-remove to decrement likes count
likeSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await this.model.decrementLikesCount(doc.contentType, doc.contentId);
  }
});

// Toggle like (like/unlike)
likeSchema.statics.toggleLike = async function (
  userId,
  contentType,
  contentId,
) {
  const existingLike = await this.findOne({
    user: userId,
    contentType: contentType,
    contentId: contentId,
  });

  if (existingLike) {
    // Unlike: remove the like
    await this.findOneAndDelete({
      user: userId,
      contentType: contentType,
      contentId: contentId,
    });
    // decrementLikesCount handled by post-findOneAndDelete middleware
    return { action: 'unliked', liked: false };
  } else {
    // Like: create new like
    await this.create({
      user: userId,
      contentType: contentType,
      contentId: contentId,
    });

    // incrementLikesCount handled by post-save func
    return { action: 'liked', liked: true };
  }
};

// Check if user has liked an Content
likeSchema.statics.hasUserLiked = async function (
  userId,
  contentType,
  contentId,
) {
  const like = await this.findOne({
    user: userId,
    contentType: contentType,
    contentId: contentId,
  });
  return !!like;
};

// Get all users who have liked a content
likeSchema.statics.getUsersWhoLiked = async function (
  contentType,
  contentId,
  options = {},
) {
  const { limit = 50, skip = 0 } = options;

  const likes = await this.find({
    contentType: contentType,
    contentId: contentId,
  })
    .populate({
      path: 'user',
      select: 'username fullName avatar',
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  return likes.map((like) => like.user);
};

// Get total likes count for a content
likeSchema.statics.getLikesCount = async function (contentType, contentId) {
  return await this.countDocuments({
    contentType: contentType,
    contentId: contentId,
  });
};

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
