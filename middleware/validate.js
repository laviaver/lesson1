function validate(schema) {
    return (req, res, next) => {
      const result = schema.safeParse(req.body);
  
      if (!result.success) {
        // Collect ALL errors at once, not just the first one
        const errors = result.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
  
        return res.status(400).json({
          error: "Validation failed",
          details: errors,
        });
      }
  
      // Replace req.body with the validated + transformed data
      // (trimming has already been applied by Zod)
      req.body = result.data;
      next();
    };
  }
  
  module.exports = validate;