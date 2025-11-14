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

// Virtual populate for comments
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
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

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
