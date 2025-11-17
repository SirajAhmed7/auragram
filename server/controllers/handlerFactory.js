// const APIFeatures = require('../utils/apiFeatures');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const docs = await features.query.explain();
    let docs = await features.query;

    // Add isLiked field if user is authenticated and Model has the method
    if (req.user && Model.addIsLikedField) {
      await Model.addIsLikedField(docs, req.user._id);
    }

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: docs.length, // No. of items in the response array
      data: {
        data: docs,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    // const tour = await Tour.findOne({ _id: req.params.id });
    let query = Model.findById(req.params.id);

    if (populateOptions) query = query.populate(populateOptions);

    let doc = await query;
    // const doc = await Model.findById(req.params.id).populate('reviews');

    if (!doc) {
      return next(new AppError(`No document found with this id`, 404));
    }

    // Add isLiked field if user is authenticated and Model has the method
    if (req.user && Model.addIsLikedField) {
      await Model.addIsLikedField(doc, req.user._id);
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    req.body.user = req.user._id;

    // const doc = await Model.create(req.body);
    const doc = new Model(req.body);
    await doc.save();

    res.status(201).json({
      stats: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`No document found with this id`, 404));
    }

    // status 200 for update too
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`No document found with this id`, 404));
    }

    // status 204 for deletion
    res.status(204).json({
      status: 'success',
      data: null, // No data is sent for a delete request
    });
  });

exports.softDeleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Model.findByIdAndUpdate(id, { active: false });

    // Status 204 for delete
    res.status(204).json({ status: 'success', data: null });
  });
