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

module.exports = router;
