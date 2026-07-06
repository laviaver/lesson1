const express = require("express");
const helmet = require("helmet");
const { apiLimiter } = require("./middleware/rateLimiter");
const requestLogger = require("./middleware/requestLogger");
const employeesRoutes = require("./routes/employees");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(apiLimiter);
app.use(requestLogger);

app.get("/", (req, res) => res.send("Server is running"));
app.use("/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/employees", employeesRoutes);

app.use(errorHandler);

module.exports = app;