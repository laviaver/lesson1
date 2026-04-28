const Employee = require("../models/Employee");

// GET ALL
async function getAllEmployees() {
  return await Employee.find();
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