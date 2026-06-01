const express = require("express");
const router = express.Router();
const { writeLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

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

// Any authenticated user can read
router.get("/", authenticate, getEmployees);
router.get("/:id", authenticate, getEmployee);

// Only admins can write
router.post("/", authenticate, authorize("admin"), writeLimiter, validate(createEmployeeSchema), createEmployee);
router.put("/:id", authenticate, authorize("admin"), writeLimiter, validate(updateEmployeeSchema), updateEmployee);
router.delete("/:id", authenticate, authorize("admin"), writeLimiter, deleteEmployee);

module.exports = router;