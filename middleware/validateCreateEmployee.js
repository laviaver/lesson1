function validateEmployee(req, res, next) {
    const { name, department } = req.body;
  
    const errors = [];
  
    if (!name || typeof name !== "string") {
      errors.push("name is required and must be a string");
    }
  
    if (!department || typeof department !== "string") {
      errors.push("department is required and must be a string");
    }
  
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }
  
    next();
  }
  
  module.exports = validateEmployee;