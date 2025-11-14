const express = require('express');

const authController = require('../controllers/authController');
const commentController = require('../controllers/commentsController');

const Comment = require('../models/commentModel');

const router = express.Router();

router.use(authController.protect);

router
  .route('/:id')
  .patch(authController.restrictToOwner(Comment), commentController.editComment)
  .delete(
    authController.restrictToOwner(Comment),
    commentController.deleteComment,
  );

router
  .route('/:id/replies')
  .post(commentController.setPostAndParentId, commentController.createComment);

module.exports = router;
