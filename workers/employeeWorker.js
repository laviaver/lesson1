const { Worker } = require("bullmq");
const { connection } = require("../config/queue");
const { sendWelcomeEmail, logEmployeeDeleted } = require("../jobs/employeeJobs");
const logger = require("../utils/logger");

// Create a worker that processes jobs from the "employee-jobs" queue
const worker = new Worker(
  "employee-jobs",  // must match the queue name exactly
  async (job) => {
    logger.info("Processing job", { jobName: job.name, jobId: job.id });

    // Route each job to the correct handler based on its name
    switch (job.name) {
      case "send-welcome-email":
        return await sendWelcomeEmail(job);

      case "log-employee-deleted":
        return await logEmployeeDeleted(job);

      default:
        logger.warn("Unknown job type", { jobName: job.name });
        throw new Error(`Unknown job: ${job.name}`);
    }
  },
  { connection }
);

// Log successful completions
worker.on("completed", (job, result) => {
  logger.info("Job completed", { jobName: job.name, jobId: job.id, result });
});

// Log failures
worker.on("failed", (job, err) => {
  logger.error("Job failed", {
    jobName: job.name,
    jobId: job.id,
    error: err.message,
    attempts: job.attemptsMade,
  });
});

logger.info("Employee worker started");

module.exports = worker;