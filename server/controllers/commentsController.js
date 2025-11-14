const Comment = require('../models/commentModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setPostAndParentId = (req, res, next) => {
  // The URL structure will determine which ID is which
  // Example URLs:
  // POST /posts/:id/comments -> id is the post
  // POST /comments/:id/replies -> id is the parent comment

  // Check the route path to determine what the :id represents
  const path = req.baseUrl;

  // if (path.includes('/posts/:id/comments')) {
  //   // Creating a top-level comment on a post
  //   req.body.post = req.params.id;
  // } else if (path.includes('/comments/:id/replies')) {
  //   // Creating a reply to a comment
  //   req.body.parentComment = req.params.id;
  //   // You might also need the post ID - could get it from the comment being replied to
  // }

  if (path.includes('/api/v1/posts')) {
    // Creating a top-level comment on a post
    req.body.post = req.params.id;
  } else if (path.includes('/api/v1/comments')) {
    // Creating a reply to a comment
    req.body.parentComment = req.params.id;
    // You might also need the post ID - could get it from the comment being replied to
  }

  next();
};

exports.createComment = factory.createOne(Comment);
exports.editComment = factory.updateOne(Comment);

exports.deleteComment = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError('No comment found with this id', 404));
  }

  // Use the softDelete instance method from the schema
  await comment.softDelete();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
