const catchAsync = (fn) => (req, res, next) => {
  // fn(req, res, next).catch((err) => next(err));
  fn(req, res, next).catch(next);

  // This works because async function returns promise and if the promise is reject it is caught
  // by the catch method and the error is passed to next() and then to the global error handler
};

module.exports = catchAsync;
