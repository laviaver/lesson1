const express = require("express");
const router = express.Router();

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
router.post("/", validateCreateEmployee, createEmployee);
router.put("/:id", validateUpdateEmployee, updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;