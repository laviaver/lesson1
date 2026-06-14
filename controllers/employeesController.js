const employeeService = require("../services/employeeService");
const asyncHandler = require("../middleware/asyncHandler");
const { NotFoundError } = require("../errors");

const getEmployees = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, department, search, sort } = req.query;
  const result = await employeeService.getAllEmployees(
    parseInt(page),
    parseInt(limit),
    { department, search, sort }
  );
  res.json(result);
});

const getEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.id);
  if (!employee) throw new NotFoundError("Employee not found");
  res.json(employee);
});

const createEmployee = asyncHandler(async (req, res) => {
  const { name, department } = req.body;
  const newEmployee = await employeeService.createEmployee(name, department);
  res.status(201).json(newEmployee);
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const result = await employeeService.deleteEmployeeById(req.params.id);
  if (!result) throw new NotFoundError("Employee not found");
  res.json({ message: "Deleted", id: req.params.id });
});

const updateEmployee = asyncHandler(async (req, res) => {
  const updated = await employeeService.updateEmployeeById(req.params.id, req.body);
  if (!updated) throw new NotFoundError("Employee not found");
  res.json(updated);
});

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  deleteEmployee,
  updateEmployee,
};