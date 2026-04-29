function validateUpdateEmployee(req, res, next) {
  const { name, department } = req.body;

  const errors = [];

  // OPTIONAL fields (but if provided → must be valid)
  if (name !== undefined && typeof name !== "string") {
    errors.push("name must be a string");
  }

  if (department !== undefined && typeof department !== "string") {
    errors.push("department must be a string");
  }

  // prevent empty update request
  if (name === undefined && department === undefined) {
    errors.push("at least one field (name or department) must be provided");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  // ✅ Normalization (AFTER validation passes)
  req.body.name = name.trim();
  req.body.department = department.trim();
  
  next();
}

module.exports = validateUpdateEmployee;