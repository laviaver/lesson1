const express = require("express");
const router = express.Router();
const { writeLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const {
  createEmployeeSchema,
  updateEmployeeSchema,
} = require("../validators/employeeValidator");

const {
  getEmployees,
  getEmployee,
  createEmployee,
  deleteEmployee,
  updateEmployee,
} = require("../controllers/employeesController");

// Routes
router.get("/", getEmployees);
router.get("/:id", getEmployee);
router.post("/", writeLimiter, validate(createEmployeeSchema), createEmployee);
router.put("/:id", writeLimiter, validate(updateEmployeeSchema), updateEmployee);
router.delete("/:id", writeLimiter, deleteEmployee);

module.exports = router;