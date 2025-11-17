const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please enter some content'],
      maxlength: [
        5000,
        'A post content must have less or equal to 5000 characters',
      ],
    },
    imageUrl: {
      type: String, // Optional image for the post
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A post must have an user'],
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
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

// Indexes for efficient queries
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ isPublished: 1, createdAt: -1 });

// Virtual populate for top-level comments only
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
  match: { parentComment: null }, // Only fetch top-level comments
});

// Update updatedAt timestamp before saving
postSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'username fullName avatar',
  });
  next();
});

// Static method to add isLiked field for a specific user
postSchema.statics.addIsLikedField = async function (posts, userId) {
  if (!userId || !posts) return posts;

  const Like = mongoose.model('Like');
  const isArray = Array.isArray(posts);
  const postsArray = isArray ? posts : [posts];

  if (postsArray.length === 0) return posts;

  // Get all post IDs
  const postIds = postsArray.map((post) => post._id);

  // Find all likes by this user for these posts in a single query
  const likes = await Like.find({
    user: userId,
    contentType: 'Post',
    contentId: { $in: postIds },
  }).select('contentId');

  // Create a Set of liked post IDs for O(1) lookup
  const likedPostIds = new Set(likes.map((like) => like.contentId.toString()));

  // Add isLiked field to each post using set() to ensure it's serialized
  for (const post of postsArray) {
    const isLiked = likedPostIds.has(post._id.toString());
    // Use set() with strict: false to allow adding fields not in schema
    post.set('isLiked', isLiked, { strict: false });
  }

  return posts;
};

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
