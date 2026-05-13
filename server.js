const express = require("express");
const connectDB = require("./config/db");
const helmet = require("helmet");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();

const employeesRoutes = require("./routes/employees");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use(helmet());
app.use("/employees", apiLimiter);

// Root route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/test", (req, res) => {
  res.send("Server is working");
});

// Use routes
app.use("/employees", employeesRoutes);

// Error handler
app.use(errorHandler);

const PORT = 3000;

async function startServer() {
  await connectDB();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
