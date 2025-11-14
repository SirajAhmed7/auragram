const express = require('express');

const authController = require('../controllers/authController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentsController');

const Post = require('../models/postModel');

const router = express.Router();

router.use(authController.protect);

router.route('/').post(postController.createPost);

router
  .route('/:id')
  .get(postController.getPost)
  .patch(authController.restrictToOwner(Post), postController.updatePost)
  .delete(authController.restrictToOwner(Post), postController.deletePost);

router
  .route('/:id/comments')
  .post(commentController.setPostAndParentId, commentController.createComment);

module.exports = router;
