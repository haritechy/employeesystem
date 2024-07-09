const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employeeController');
const employeeController1 = require('../controller/attendenceController');
router.get('/', employeeController.getAllEmployees);
router.post('/employeeId/salary-slip', employeeController.generateSalarySlip);
router.post('/', employeeController.createEmployee);
router.get('/employees/:employeeId/salary/:filter', employeeController1.calculateSalary);
module.exports = router;
