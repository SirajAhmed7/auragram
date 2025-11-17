const Like = require('../models/likeModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Middleware to set contentType from URL parameter
exports.setContentTypeFromParam = (req, _res, next) => {
  const { contentTypeParam } = req.params;

  if (!contentTypeParam) {
    return next(new AppError('Content type parameter is required', 400));
  }

  // Normalize: remove plural 's', then capitalize (posts -> Post, comments -> Comment)
  let singular = contentTypeParam;
  if (singular.endsWith('s')) {
    singular = singular.slice(0, -1); // Remove trailing 's'
  }
  const contentType = singular.charAt(0).toUpperCase() + singular.slice(1);

  // Validate contentType
  if (!['Post', 'Comment'].includes(contentType)) {
    return next(
      new AppError('Content type must be either posts or comments', 400),
    );
  }

  req.contentType = contentType;
  next();
};

// Middleware to set contentType based on the route (for nested routes)
exports.setContentType = (contentType) => (req, _res, next) => {
  req.contentType = contentType;
  next();
};

// Toggle like (like/unlike) for a post or comment
exports.toggleLike = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const contentType = req.contentType; // Set by setContentType middleware

  // Toggle the like using the model's static method
  const result = await Like.toggleLike(userId, contentType, id);

  res.status(200).json({
    status: 'success',
    data: {
      action: result.action,
      liked: result.liked,
    },
  });
});

// Get all users who liked a specific content
exports.getUsersWhoLiked = catchAsync(async (req, res) => {
  const { id } = req.params;
  const contentType = req.contentType; // Set by setContentType middleware
  const limit = parseInt(req.query.limit) || 50;
  const skip = parseInt(req.query.skip) || 0;

  const users = await Like.getUsersWhoLiked(contentType, id, {
    limit,
    skip,
  });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

// Check if the current user has liked a content
exports.checkIfLiked = catchAsync(async (req, res) => {
  const { id } = req.params;
  const contentType = req.contentType; // Set by setContentType middleware
  const userId = req.user._id;

  const liked = await Like.hasUserLiked(userId, contentType, id);

  res.status(200).json({
    status: 'success',
    data: {
      liked,
    },
  });
});

// Get total likes count for a content
exports.getLikesCount = catchAsync(async (req, res) => {
  const { id } = req.params;
  const contentType = req.contentType; // Set by setContentType middleware

  const count = await Like.getLikesCount(contentType, id);

  res.status(200).json({
    status: 'success',
    data: {
      count,
    },
  });
});
