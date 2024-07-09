const express = require('express');
const router = express.Router();
const attendanceController = require('../controller/attendenceController');

router.post('/checkin', attendanceController.checkIn);
router.post('/checkout', attendanceController.checkOut);
router.get('/attendanceRecords/all', attendanceController.getAllEmployees);
router.get('/attendanceRecords/:employeeId', attendanceController.getAllAttendanceRecords);
router.get('/attendanceRecords/', attendanceController.getAttendanceByDate);
router.get('/attendanceRecords/all', attendanceController.getAllEmployees);

// router.get('/calculate-salary', attendanceController.calculateSalary);

module.exports = router;
