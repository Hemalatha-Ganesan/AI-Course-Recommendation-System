const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

const adminController = require('../controllers/adminController');

// 🔒 Get all users
router.get('/users', protect, isAdmin, adminController.getAllUsers);

// 🔒 Delete user
router.delete('/users/:id', protect, isAdmin, adminController.deleteUser);

// 🔒 Get admin stats
router.get('/stats', protect, isAdmin, adminController.getAdminStats);

// 🔒 Get recent history
router.get('/history', protect, isAdmin, adminController.getRecentHistory);

// 🔒 Get all courses
router.get('/courses', protect, isAdmin, adminController.getAllCourses);

// 🔒 Get detailed students
router.get('/students-detailed', protect, isAdmin, adminController.getStudentsDetailed);

// 🔒 Create new course
router.post('/courses', protect, isAdmin, adminController.createCourse);

// 🔒 Update course
router.put('/courses/:id', protect, isAdmin, adminController.updateCourse);

// 🔒 Student leaderboard
router.get('/leaderboard', protect, isAdmin, adminController.getStudentLeaderboard);

// 🔒 Delete course
router.delete('/courses/:id', protect, isAdmin, adminController.deleteCourse);

module.exports = router;
