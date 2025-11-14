const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const cors = require('cors');

const deepSanitize = require('./utils/deepSanitize');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');

const app = express();

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// Set security HTTP headers
app.use(helmet());

// Limit requests from same IP
// 500 requests per 30 minutes
const limiter = rateLimit({
  max: 1000,
  windowMs: 30 * 60 * 500,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Parse JSON body
app.use(bodyParser.json({ limit: '10kb' }));

// Parse cookies
app.use(cookieParser());

// // Data sanitazation against NoSQL injection
// app.use(mongooseSanitize());

// Data sanitazation against XSS
app.use((req, res, next) => {
  req.body = deepSanitize(req.body);
  next();
});

// Serving static files (might not be needed in production)
app.use(express.static(`${__dirname}/public`));

// Create HTTP server
const server = createServer(app);

// ROUTES
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Hello World!' });
});

app.use('/api/v1/users', userRouter);

app.use(globalErrorHandler);

module.exports = server;
