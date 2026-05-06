function validateEmployee(req, res, next) {
  let { name, department } = req.body;

  const errors = [];

  // Validation
  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.push("name is required and must be a non-empty string");
  }

  if (!department || typeof department !== "string" || department.trim() === "") {
    errors.push("department is required and must be a non-empty string");
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

module.exports = validateEmployee;