const Post = require('../models/postModel');
const factory = require('./handlerFactory');

exports.getAllPosts = factory.getAll(Post);
exports.createPost = factory.createOne(Post);
exports.getPost = factory.getOne(Post, {
  path: 'comments',
  options: { sort: { createdAt: -1 } },
  populate: {
    path: 'replies',
    options: { sort: { createdAt: -1 } },
    populate: {
      path: 'replies',
      options: { sort: { createdAt: -1 } },
      populate: {
        path: 'replies',
        options: { sort: { createdAt: -1 } },
      },
    },
  },
});
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
exports.softDeletePost = factory.softDeleteOne(Post);
