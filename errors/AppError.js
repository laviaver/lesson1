// Base class — all custom errors extend this
class AppError extends Error {
    constructor(message, status) {
      super(message); // passes message to the built-in Error class
      this.status = status;
      this.isOperational = true; // marks this as an expected, handled error
  
      // Keeps the stack trace clean — points to where the error was thrown,
      // not to this constructor
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;