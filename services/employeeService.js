const Employee = require("../models/Employee");
const { invalidateEmployeeCache } = require("./cacheService");
const { employeeQueue } = require("../config/queue");         

// ✅ Whitelist of fields that are safe to sort by
const ALLOWED_SORT_FIELDS = new Set(["name", "department", "createdAt"]);

// GET ALL
async function getAllEmployees(page = 1, limit = 10, filters = {}) {
  const skip = (page - 1) * limit;

  const query = {};

  // FILTER
  if (filters.department) {
    query.department = filters.department;
  }

  // SEARCH — switched from $regex to $text (uses the text index)
  if (filters.search && filters.search.trim() !== "") {
    query.$text = { $search: filters.search.trim() };
  }

  // SORTING — now validates the field before using it
  let sortOption = { createdAt: -1 }; // default

  if (filters.sort) {
    const field = filters.sort.startsWith("-")
      ? filters.sort.substring(1)
      : filters.sort;

    const direction = filters.sort.startsWith("-") ? -1 : 1;

    // ✅ Only apply sort if the field is in the whitelist
    if (ALLOWED_SORT_FIELDS.has(field)) {
      sortOption = { [field]: direction };
    }
    // If field is not allowed, silently fall back to default sort
  }

  // PARALLEL QUERIES
  let findQuery = Employee.find(query);

  if (!query.$text) {
    findQuery = findQuery.collation({ locale: "en" });
  }

  const [employees, total] = await Promise.all([
    findQuery.sort(sortOption).skip(skip).limit(limit),
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
  const saved = await employee.save();         // ✅ store result before invalidating
  await invalidateEmployeeCache();             // ✅ clear stale cache after successful save
  
  // queue welcome email job after successful save
  await employeeQueue.add("send-welcome-email", {
    name: saved.name,
    department: saved.department,
    employeeId: saved._id,
  });

  return saved;                                // ✅ return the stored result instead of the save() promise directly
}

// DELETE
async function deleteEmployeeById(id) {
  const result = await Employee.findByIdAndDelete(id);
  if (result) {
    await invalidateEmployeeCache();
    await employeeQueue.add("log-employee-deleted", {
      employeeId: result._id,
      name: result.name,
      department: result.department,
    });
  }
  return result;
}

// UPDATE
async function updateEmployeeById(id, updates) {
  const updated = await Employee.findByIdAndUpdate(    // ✅ CHANGED — stored in variable so we can check it
    id,
    updates,
    { new: true, runValidators: true }
  );
  if (updated) await invalidateEmployeeCache();        // ✅ NEW LINE — only invalidate if something was actually updated
  return updated;                                      // ✅ NEW LINE — explicitly return result
}

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployeeById,
  updateEmployeeById,
};