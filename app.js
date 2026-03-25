  const fs = require("fs");

  // Load employees from file
  function loadEmployees() {
      try {
        const data = fs.readFileSync("employees.json", "utf-8");
    
        if (!data) {
          return [];
        }
    
        return JSON.parse(data);
      } catch (error) {
        console.log("Error reading file, returning empty list");
        return [];
      }
    }

    function deleteEmployee(id) {
      let employees = loadEmployees();
    
      employees = employees.filter(emp => emp.id !== id);
    
      saveEmployees(employees);
    
      console.log("Employee deleted:", id);
    }

    function updateEmployee(id, newDepartment) {
      let employees = loadEmployees();
    
      const employee = employees.find(emp => emp.id === id);
    
      if (employee) {
        employee.department = newDepartment;
        saveEmployees(employees);
        console.log("Employee updated:", employee);
      } else {
        console.log("Employee not found");
      }
    }

  // Save employees to file
  function saveEmployees(employees) {
    fs.writeFileSync("employees.json", JSON.stringify(employees, null, 2));
  }

  // Add employee
  function addEmployee(name, department) {
    let employees = loadEmployees();

    const maxId = employees.length > 0
  ? Math.max(...employees.map(emp => emp.id))
  : 0;

const newEmployee = {
  id: maxId + 1,
  name: name,
  department: department,
};

    employees.push(newEmployee);
    saveEmployees(employees);

    console.log("Employee added:", newEmployee);
  }

  // List employees
  function listEmployees() {
    const employees = loadEmployees();
    console.log("All employees:");
    console.log(employees);
  }

  // CLI handling
  const command = process.argv[2];

  if (command === "add") {
    const name = process.argv[3];
    const department = process.argv[4];
    addEmployee(name, department);
  } else if (command === "list") {
    listEmployees();
  }else if (command === "delete") {
    const id = parseInt(process.argv[3]);
    deleteEmployee(id);
  } else if (command === "update") {
    const id = parseInt(process.argv[3]);
    const department = process.argv[4];
    updateEmployee(id, department);
  }
