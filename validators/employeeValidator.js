const { z } = require("zod");

// The shape of a valid employee on creation
const createEmployeeSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),

  department: z
    .string({ required_error: "Department is required" })
    .min(2, "Department must be at least 2 characters")
    .max(100, "Department cannot exceed 100 characters")
    .trim(),
});

// The shape of a valid employee on update — both fields optional
// but at least one must be present
const updateEmployeeSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters")
      .trim()
      .optional(),

    department: z
      .string()
      .min(2, "Department must be at least 2 characters")
      .max(100, "Department cannot exceed 100 characters")
      .trim()
      .optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.department !== undefined,
    { message: "At least one field (name or department) must be provided" }
  );

module.exports = { createEmployeeSchema, updateEmployeeSchema };