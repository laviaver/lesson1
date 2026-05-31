const express = require("express");
const router = express.Router();
const { writeLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
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

router.get("/", authenticate, getEmployees);
router.get("/:id", authenticate, getEmployee);
router.post("/", authenticate, writeLimiter, validate(createEmployeeSchema), createEmployee);
router.put("/:id", authenticate, writeLimiter, validate(updateEmployeeSchema), updateEmployee);
router.delete("/:id", authenticate, writeLimiter, deleteEmployee);

module.exports = router;