const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  if (err.name === "CastError") {
    err.status = 400;
    err.message = "Invalid ID";
  }

  const status = err.status || 500;

  logger.error(err.message, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    status,
  });

  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
}

module.exports = errorHandler;
