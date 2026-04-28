const employeeService = require("../services/employeeService");
const asyncHandler = require("../middleware/asyncHandler");

// GET all
const getEmployees = asyncHandler(async (req, res) => {
  const employees = await employeeService.getAllEmployees();
  res.json(employees);
});

// GET by ID
const getEmployee = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const employee = await employeeService.getEmployeeById(id);

  if (!employee) {
    const error = new Error("Employee not found");
    error.status = 404;
    throw error;
  }

  res.json(employee);
});

// POST
const createEmployee = asyncHandler(async (req, res) => {
  const { name, department } = req.body;

  const newEmployee = await employeeService.createEmployee(name, department);

  res.status(201).json(newEmployee);
});

// DELETE
const deleteEmployee = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);

  const result = await employeeService.deleteEmployeeById(id);

  if (!result) {
    const error = new Error("Employee not found");
    error.status = 404;
    throw error;
  }

  res.json({ message: "Deleted", id });
});

// PUT
const updateEmployee = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);

  const updated = await employeeService.updateEmployeeById(id, req.body);

  if (!updated) {
    const error = new Error("Employee not found");
    error.status = 404;
    throw error;
  }

  res.json(updated);
});

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  deleteEmployee,
  updateEmployee
};