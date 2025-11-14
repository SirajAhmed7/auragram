const Post = require('../models/postModel');
const factory = require('./handlerFactory');

exports.createPost = factory.createOne(Post);
exports.getPost = factory.getOne(Post, { path: 'comments' });
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
exports.softDeletePost = factory.softDeleteOne(Post);
