const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const { getVerificationEmailHTML } = require('../utils/emailHTML');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    sameSite: 'lax',
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    fullName: req.body.fullName.trim(),
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);

  try {
    await sendEmail({
      email: newUser.email, // or req.body.email
      subject: 'Auragram verification email!',
      html: getVerificationEmailHTML(
        process.env.FRONTEND_URL,
        newUser.fullName,
      ),
    });
  } catch {
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // 1) Check if username and password exist
  if (!username || !password) {
    return next(new AppError('Please provide username and password!', 400));
  }

  // 2) Check if user exists and password is correct
  const user = await User.findOne({ username }).select('+password'); // select a field additional to the default fields (select: false)
  // const correct = await user.correctPassword(password, user.password);

  // Checking for both together so as to not give the attacker info whether the username or password is incorrect
  if (!user || !(await user.correctPassword(password, user.password))) {
    // 401 for unauthorized
    return next(new AppError('Incorrect username or password!', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.isLoggedIn = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ').at(1);
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      // 1) Verify token
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET,
      );

      // 2) Check if user exists
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return next(new AppError('Please log in to get access.', 401));
      }

      // // 4) Check if user changed password after the token was issued
      // if (currentUser.changedPasswordAfter(decoded.iat)) {
      //   return next(new AppError('Please log in to get access.', 401));
      // }

      // THERE IS A LOGGED IN USER
      // res.locals.user = currentUser;
      // return next();
      // currentUser.passwordChangedAt = undefined;

      res.status(200).json({ status: 'success', data: { user: currentUser } });
      return;
    } catch {
      return next(new AppError('Please log in to get access.', 401));
      // return res.status(401).json({ loggedIn: 'N' });
    }
  }
  next(
    new AppError('Your are not logged in! Please log in to get access.', 401),
  );
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ').at(1);
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('Your are not logged in! Please log in to get access.', 401),
    );
  }

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exist.', 401),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictToOwner = (Model) =>
  catchAsync(async (req, _res, next) => {
    // 1) Find the document
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // 2) Check if the current user is the owner of the document
    // Convert both to strings for comparison to handle ObjectId vs string
    if (doc.user._id.toString() !== req.user._id.toString()) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    // 3) Grant access if user is the owner
    next();
  });
