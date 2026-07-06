const { jest } = require("@jest/globals");

// Mock the Employee model — replace it with a fake version
// This means tests never touch a real database
jest.mock("../../models/Employee");
jest.mock("../../services/cacheService");
jest.mock("../../config/queue");

const Employee = require("../../models/Employee");
const { invalidateEmployeeCache } = require("../../services/cacheService");
const { employeeQueue } = require("../../config/queue");
const employeeService = require("../../services/employeeService");

// Group related tests together with describe()
describe("employeeService", () => {

  // Reset all mocks before each test
  // This prevents one test's mock behavior from leaking into the next
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- getAllEmployees ---
  describe("getAllEmployees", () => {

    test("returns paginated results with defaults", async () => {
      // Arrange — set up what the fake Employee model should return
      // This chain mocks: Employee.find().collation().sort().skip().limit()
      const mockEmployees = [
        { _id: "1", name: "Alice", department: "HR" },
        { _id: "2", name: "Bob", department: "Engineering" },
      ];

      Employee.find.mockReturnValue({
        collation: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockEmployees),
      });

      Employee.countDocuments.mockResolvedValue(2);

      // Act — call the function you're testing
      const result = await employeeService.getAllEmployees();

      // Assert — verify the output is what you expect
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    test("applies department filter when provided", async () => {
      Employee.find.mockReturnValue({
        collation: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });
      Employee.countDocuments.mockResolvedValue(0);

      await employeeService.getAllEmployees(1, 10, { department: "HR" });

      // Verify Employee.find was called with the correct query
      expect(Employee.find).toHaveBeenCalledWith(
        expect.objectContaining({ department: "HR" })
      );
    });

  });

  // --- createEmployee ---
  describe("createEmployee", () => {

    test("saves employee and invalidates cache", async () => {
      // Arrange — mock the save operation
      const mockSaved = { _id: "123", name: "Alice", department: "HR" };
      const mockEmployee = { save: jest.fn().mockResolvedValue(mockSaved) };
      Employee.mockImplementation(() => mockEmployee);
      invalidateEmployeeCache.mockResolvedValue();
      employeeQueue.add.mockResolvedValue();

      // Act
      const result = await employeeService.createEmployee("Alice", "HR");

      // Assert
      expect(mockEmployee.save).toHaveBeenCalled();
      expect(invalidateEmployeeCache).toHaveBeenCalled();
      expect(employeeQueue.add).toHaveBeenCalledWith(
        "send-welcome-email",
        expect.objectContaining({ name: "Alice", department: "HR" })
      );
    });

  });

  // --- deleteEmployeeById ---
  describe("deleteEmployeeById", () => {

    test("deletes employee, invalidates cache, and queues audit job", async () => {
      const mockEmployee = { _id: "123", name: "Alice", department: "HR" };
      Employee.findByIdAndDelete.mockResolvedValue(mockEmployee);
      invalidateEmployeeCache.mockResolvedValue();
      employeeQueue.add.mockResolvedValue();

      const result = await employeeService.deleteEmployeeById("123");

      expect(result).toEqual(mockEmployee);
      expect(invalidateEmployeeCache).toHaveBeenCalled();
      expect(employeeQueue.add).toHaveBeenCalledWith(
        "log-employee-deleted",
        expect.objectContaining({ employeeId: "123" })
      );
    });

    test("does not invalidate cache if employee not found", async () => {
      Employee.findByIdAndDelete.mockResolvedValue(null);

      await employeeService.deleteEmployeeById("nonexistent");

      expect(invalidateEmployeeCache).not.toHaveBeenCalled();
    });

  });

});