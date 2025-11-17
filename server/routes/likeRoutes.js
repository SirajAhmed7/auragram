const express = require('express');

const authController = require('../controllers/authController');
const likeController = require('../controllers/likeController');

const router = express.Router();

// All routes require authentication
router.use(authController.protect);

// Like routes that work for both posts and comments
// Pattern: /:contentTypeParam/:id/like/*
// Examples:
//   - /posts/123abc/like
//   - /comments/456def/like/users

router
  .route('/:contentTypeParam/:id/like')
  .post(likeController.setContentTypeFromParam, likeController.toggleLike);

router
  .route('/:contentTypeParam/:id/like/users')
  .get(likeController.setContentTypeFromParam, likeController.getUsersWhoLiked);

router
  .route('/:contentTypeParam/:id/like/check')
  .get(likeController.setContentTypeFromParam, likeController.checkIfLiked);

router
  .route('/:contentTypeParam/:id/like/count')
  .get(likeController.setContentTypeFromParam, likeController.getLikesCount);

module.exports = router;
