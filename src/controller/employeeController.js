const {
  createEmployee,
  findEmployeeById,
  updateEmployee,
} = require("../utils/employeeutill");
const {
  calculateTotalHours,
  calculateSalary,
  calculatePF,
} = require("../utils/attendanceutills"); // Import necessary utility functions
const Attendance = require("../models/attendence");
const Employee = require("../models/employee");

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  const { 
    employeeId, 
    name, 
    email, 
    position, 
    department, 
    hourlyRate,
    bankCode,
    branchName,
    bankName,
    bankBranch,
    bankAccountNumber,
    costCentre,
    ccDescription,
    grade,
    employeeGroup,
    panNumber 
  } = req.body;
  
  const employeeData = {
    employeeId,
    name,
    email,
    position,
    department,
    hourlyRate,
    bankCode,
    branchName,
    bankName,
    bankBranch,
    bankAccountNumber,
    costCentre,
    ccDescription,
    grade,
    employeeGroup,
    panNumber
  };

  try {
    const employee = await createEmployee(employeeData);
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an existing employee
exports.updateEmployee = async (req, res) => {
  const { employeeId } = req.params;
  const updateData = req.body;
  try {
    const updatedEmployee = await updateEmployee(employeeId, updateData);
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.generateSalarySlip = async (req, res) => {
  const { employeeId } = req.body;
  const { filter } = req.query;

  try {
    // Fetch employee details
    const employee = await Employee.findOne({ employeeId: employeeId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Fetch attendance records based on the filter
    let startDate, endDate;
    if (filter === "currentMonth") {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      startDate = new Date(currentYear, currentMonth - 1, 1);
      endDate = new Date(currentYear, currentMonth, 1);
    } else if (filter === "lastMonth") {
      const lastMonth = new Date().getMonth();
      const lastMonthYear = new Date().getFullYear();
      startDate = new Date(lastMonthYear, lastMonth - 1, 1);
      endDate = new Date(lastMonthYear, lastMonth, 1);
    } else {
      return res.status(400).json({ message: "Invalid filter parameter" });
    }

    const attendanceRecords = await Attendance.find({
      employee: employee._id,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    // Calculate total hours, salary, PF amount, and gross salary
    const totalHours = calculateTotalHours(attendanceRecords);
    const salary = calculateSalary(totalHours, employee.hourlyRate);
    const pfAmount = calculatePF(salary);
    const grossSalary = salary - pfAmount;

    // Prepare salary slip object with additional details
    const salarySlip = {
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      position: employee.position,
      department: employee.department,
      startDate: startDate,
      endDate: endDate,
      totalHours: totalHours,
      salary: salary.toFixed(2),
      pfAmount: pfAmount.toFixed(2),
      grossSalary: grossSalary.toFixed(2),
      slipNumber: generateSlipNumber(), // Generate or fetch slip number
      bankDetails: {
        bankCode: employee.bankCode,
        branchName: employee.branchName,
        bankName: employee.bankName,
        bankBranch: employee.bankBranch,
        bankAccountNumber: employee.bankAccountNumber,
      },
      additionalDetails: {
        costCentre: employee.costCentre,
        ccDescription: employee.ccDescription,
        grade: employee.grade,
        employeeGroup: employee.employeeGroup,
        panNumber: employee.panNumber,
        payPeriod: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      },
      payments: {
        basicSalary: salary.toFixed(2),
        totalPayments: salary.toFixed(2), // Assuming total payments is just the basic salary
      },
      deductions: {
        providentFund: pfAmount.toFixed(2),
        totalDeductions: pfAmount.toFixed(2), // Assuming total deductions is just the provident fund
      },
      netSalary: (salary - pfAmount).toFixed(2),
    };

    res.status(200).json(salarySlip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Function to generate or fetch slip number (dummy implementation)
const generateSlipNumber = () => {
  return `SLIP-${Date.now()}`;
};
