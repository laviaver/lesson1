const express = require("express");
const app = express();

const employeesRoutes = require("./routes/employees");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Use routes
app.use("/employees", employeesRoutes);

// Error handler
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



