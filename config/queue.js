const { Queue } = require("bullmq");
const logger = require("../utils/logger");

// BullMQ connection config — separate from your main redis client
const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT) || 6379,
};

// The employee queue — jobs related to employee operations go here
const employeeQueue = new Queue("employee-jobs", { connection });

// Log when queue connects successfully
employeeQueue.on("error", (err) => {
  logger.error("Queue error", { error: err.message });
});

module.exports = { employeeQueue, connection };