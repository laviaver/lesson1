const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// --- Indexes ---

// Speeds up ?department=HR filtering
employeeSchema.index({ department: 1 });

// Speeds up ?sort=-createdAt (the most common default sort)
employeeSchema.index({ createdAt: -1 });

// Speeds up ?sort=name
employeeSchema.index({ name: 1 });

// Enables efficient full-text search across name + department
// Replaces your $regex approach for search
employeeSchema.index(
  { name: "text", department: "text" },
  { name: "employee_text_search" }
);

module.exports = mongoose.model("Employee", employeeSchema);
