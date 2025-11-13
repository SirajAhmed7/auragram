const jwt = require('jsonwebtoken');
// const { promisify } = require('util');

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
