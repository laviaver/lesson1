const express = require("express");
const helmet = require("helmet");
const connectDB = require("./config/db");
const { apiLimiter } = require("./middleware/rateLimiter");
const requestLogger = require("./middleware/requestLogger");
const employeesRoutes = require("./routes/employees");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const app = express();

// Security & parsing — order matters
app.use(helmet());
app.use(express.json());
app.use(apiLimiter);
app.use(requestLogger);

// Routes
app.get("/", (req, res) => res.send("Server is running"));
app.use("/auth", authRoutes);
app.use("/employees", employeesRoutes);

// Error handler — always last
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();
  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}

startServer();