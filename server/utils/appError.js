class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // calling the parent class

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // When a new error object is created and the constructor function is called then the
    // constructor function call will not appear in the stack trace and will not pollute it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
