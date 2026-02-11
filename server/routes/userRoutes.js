// const express = require('express');
// const router = express.Router();
// const { createUser } = require('../controllers/userController');

// router.post('/', createUser);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserProfile,
  getUserAnalytics,
  getLearningHistory
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);

// User routes (own profile or admin)
router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUser);
router.get('/:id/profile', protect, getUserProfile);
router.get('/:id/analytics', protect, getUserAnalytics);
router.get('/:id/history', protect, getLearningHistory);

module.exports = router;
