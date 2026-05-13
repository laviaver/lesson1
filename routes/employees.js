const express = require("express");
const router = express.Router();
const { writeLimiter } = require("../middleware/rateLimiter");

const {
  getEmployees,
  getEmployee,
  createEmployee,
  deleteEmployee,
  updateEmployee
} = require("../controllers/employeesController");

const validateUpdateEmployee = require("../middleware/validateUpdateEmployee");

const validateCreateEmployee = require("../middleware/validateCreateEmployee");

// Routes
router.get("/", getEmployees);
router.get("/:id", getEmployee);
router.post("/", writeLimiter, validateCreateEmployee, createEmployee);
router.put("/:id", writeLimiter, validateUpdateEmployee, updateEmployee);
router.delete("/:id", writeLimiter, deleteEmployee);

module.exports = router;