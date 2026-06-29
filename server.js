const express = require("express");
const helmet = require("helmet");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const { apiLimiter } = require("./middleware/rateLimiter");
const requestLogger = require("./middleware/requestLogger");
const employeesRoutes = require("./routes/employees");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");
const gracefulShutdown = require("./utils/shutdown");

const app = express();

app.use(helmet());
app.use(express.json());

// Health probes must not be rate-limited
app.get("/", (req, res) => res.send("Server is running"));
app.use("/health", healthRoutes);

app.use(apiLimiter);
app.use(requestLogger);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/employees", employeesRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

function registerShutdownHandlers(server, worker) {
  const handleShutdown = (signal) => {
    gracefulShutdown(signal, server, worker).catch((err) => {
      logger.error("Shutdown failed", { error: err.message, stack: err.stack });
      process.exit(1);
    });
  };

  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  process.on("SIGINT", () => handleShutdown("SIGINT"));
}

async function startServer() {
  await connectDB();
  await connectRedis();
  const worker = require("./workers/employeeWorker");

  const server = app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });

  registerShutdownHandlers(server, worker);
}

startServer().catch((err) => {
  logger.error("Server failed to start", { error: err.message, stack: err.stack });
  process.exit(1);
});
