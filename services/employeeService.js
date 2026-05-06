const Employee = require("../models/Employee");

// GET ALL
async function getAllEmployees(page = 1, limit = 10, filters = {}) {
  const skip = (page - 1) * limit;

  const query = {};

   // ✅ FILTER
  if (filters.department) {
    query.department = filters.department;
  }

   // ✅ SEARCH
   if (filters.search && filters.search.trim() !== "") {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { department: { $regex: filters.search, $options: "i" } },
    ];
  }

  const [employees, total] = await Promise.all([
    Employee.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Employee.countDocuments(query),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: employees,
  };
}

// GET BY ID
async function getEmployeeById(id) {
  return await Employee.findById(id);
}

// CREATE
async function createEmployee(name, department) {
  const employee = new Employee({ name, department });
  return await employee.save();
}

// DELETE
async function deleteEmployeeById(id) {
  const result = await Employee.findByIdAndDelete(id);
  return result;
}

// UPDATE
async function updateEmployeeById(id, updates) {
  return await Employee.findByIdAndUpdate(
    id,
    updates,
    { new: true } // return updated document
  );
}

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployeeById,
  updateEmployeeById
};