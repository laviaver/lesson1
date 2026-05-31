const { z } = require("zod");

const registerSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .trim()
    .toLowerCase(),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),

  role: z
    .enum(["user", "admin"])
    .optional()
    .default("user"),
});

const loginSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .toLowerCase(),

  password: z
    .string({ required_error: "Password is required" }),
});

module.exports = { registerSchema, loginSchema };