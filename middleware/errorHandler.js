const logger = require("../utils/logger");
const { AppError } = require("../errors");

function errorHandler(err, req, res, next) {
// Log every error with context
  logger.error(err.message, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    status: err.status || 500,
    isOperational: err.isOperational || false,
  });

  // Operational error — expected failure, return clean response
  if (err.isOperational) {
    return res.status(err.status).json({
      error: err.message,
    });
  }

 // Programmer error — something unexpected broke
// Don't leak internal details to the client
  return res.status(500).json({
    error: "Something went wrong. Please try again later.",
  });
}

module.exports = errorHandler;
