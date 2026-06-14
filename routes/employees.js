const express = require("express");
const router = express.Router();
const { writeLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const cache = require("../middleware/cache");

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

const CACHE_TTL = parseInt(process.env.CACHE_TTL || 60);

// Any authenticated user can read
router.get("/", authenticate, cache(CACHE_TTL), getEmployees);
router.get("/:id", authenticate, getEmployee);

// Only admins can write
router.post("/", authenticate, authorize("admin"), writeLimiter, validate(createEmployeeSchema), createEmployee);
router.put("/:id", authenticate, authorize("admin"), writeLimiter, validate(updateEmployeeSchema), updateEmployee);
router.delete("/:id", authenticate, authorize("admin"), writeLimiter, deleteEmployee);

module.exports = router;