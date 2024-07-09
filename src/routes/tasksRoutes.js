const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');

// Get all tasks
router.get('/', taskController.getAllTasks);

// Create a new task
router.post('/', taskController.createTask);

module.exports = router;
