const express = require("express");

const app = express();
const PORT = 3000;
app.use(express.json());

// Route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// GET /employees
app.get("/employees", (req, res) => {
    console.log("GET /employees called");
    const employees = loadEmployees();
    res.json(employees);
  });
  

// POST /employees
app.post("/employees", (req, res) => {
  console.log("POST /employees called");

  const { name, department } = req.body;

  if (!name || !department) {
    return res.status(400).json({ error: "Missing name or department" });
  }

  let employees = loadEmployees();

  const maxId = employees.length > 0
    ? Math.max(...employees.map(emp => emp.id))
    : 0;

  const newEmployee = {
    id: maxId + 1,
    name,
    department
  };

  employees.push(newEmployee);
  saveEmployees(employees);

  res.status(201).json(newEmployee);
});

// DELETE /employees/:id
app.delete("/employees/:id", (req, res) => {
  console.log("DELETE /employees called");

  const id = parseInt(req.params.id);

  let employees = loadEmployees();

  const employeeExists = employees.some(emp => emp.id === id);

  if (!employeeExists) {
    return res.status(404).json({ error: "Employee not found" });
  }

  employees = employees.filter(emp => emp.id !== id);

  saveEmployees(employees);

  res.json({ message: "Employee deleted", id });
});

  // Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const fs = require("fs");

// reuse your function
function loadEmployees() {
  try {
    const data = fs.readFileSync("employees.json", "utf-8");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

