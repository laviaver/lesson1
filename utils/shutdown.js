const logger = require("./logger");

let isShuttingDown = false;

async function gracefulShutdown(signal, server, worker) {
  if (isShuttingDown) {
    logger.warn(`${signal} received but shutdown already in progress`);
    return;
  }
  isShuttingDown = true;

  logger.info(`${signal} received — starting graceful shutdown`);

  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        logger.error("Error closing HTTP server", { error: err.message });
        return reject(err);
      }
      logger.info("HTTP server closed — no longer accepting requests");
      resolve();
    });
  });

  try {
    await worker.close();
    logger.info("Worker closed");
  } catch (err) {
    logger.error("Error closing worker", { error: err.message });
  }

  const { employeeQueue } = require("../config/queue");
  try {
    await employeeQueue.close();
    logger.info("Employee queue closed");
  } catch (err) {
    logger.error("Error closing employee queue", { error: err.message });
  }

  const mongoose = require("mongoose");
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  } catch (err) {
    logger.error("Error closing MongoDB", { error: err.message });
  }

  const { redisClient } = require("../config/redis");
  try {
    await redisClient.quit();
    logger.info("Redis connection closed");
  } catch (err) {
    logger.error("Error closing Redis", { error: err.message });
  }

  logger.info("Graceful shutdown complete");
  process.exit(0);
}

module.exports = gracefulShutdown;
