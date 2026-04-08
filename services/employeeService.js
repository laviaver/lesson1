const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../employees.json");

// LOAD
async function loadEmployees() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// SAVE
async function saveEmployees(employees) {
  await fs.writeFile(filePath, JSON.stringify(employees, null, 2));
}

// GET ALL
async function getAllEmployees() {
  return await loadEmployees();
}

// GET BY ID
async function getEmployeeById(id) {
  const employees = await loadEmployees();
  return employees.find(emp => emp.id === id);
}

// CREATE
async function createEmployee(name, department) {
  const employees = await loadEmployees();

  const maxId = employees.length > 0
    ? Math.max(...employees.map(emp => emp.id))
    : 0;

  const newEmployee = {
    id: maxId + 1,
    name,
    department
  };

  employees.push(newEmployee);
  await saveEmployees(employees);

  return newEmployee;
}

// DELETE
async function deleteEmployeeById(id) {
  let employees = await loadEmployees();

  const exists = employees.some(emp => emp.id === id);
  if (!exists) return null;

  employees = employees.filter(emp => emp.id !== id);
  await saveEmployees(employees);

  return true;
}

// UPDATE
async function updateEmployeeById(id, updates) {
  const employees = await loadEmployees();

  const employee = employees.find(emp => emp.id === id);
  if (!employee) return null;

  if (updates.name !== undefined) employee.name = updates.name;
  if (updates.department !== undefined) employee.department = updates.department;

  await saveEmployees(employees);

  return employee;
}

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployeeById,
  updateEmployeeById
};