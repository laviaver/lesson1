const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/authValidator");
const { register, login } = require("../controllers/authController");

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));

module.exports = router;