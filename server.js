const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const logger = require("./utils/logger");
const gracefulShutdown = require("./utils/shutdown");
const app = require("./app");

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();
  await connectRedis();

  const worker = require("./workers/employeeWorker");

  const server = app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM", server, worker));
  process.on("SIGINT", () => gracefulShutdown("SIGINT", server, worker));
}

startServer();