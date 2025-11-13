const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);

  // In unhandledRejection crashing the application is optional but in uncaughtException crashing the application
  // is very important because after an uncaughtException occurs the entire node process is in a so called unclean state
  process.exit(1);
});

const server = require('./app');

const DB = process.env.DATABASE_URI.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log('Database connected successfully!');
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Env is', process.env.NODE_ENV);
  console.log(`Server is running on port ${port}`);
});

// GLOBALLY HANDLE UNHANDLED REJECTIONS
// 'unhandledRejection' handles errors that occur in async code
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);

  // First close the server (Finish pending requests) then kill the server
  // In production you need to have a tool that restarts the application after crashing
  server.close(() => {
    process.exit(1);
  });
});
