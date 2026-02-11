const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses,
  updateProgress,
  getCategories,
  getTrendingCourses
} = require('../controllers/courseController');
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');

// Public routes
router.get('/', optionalAuth, getAllCourses);
router.get('/categories', getCategories);
router.get('/trending', getTrendingCourses);
router.get('/:id', optionalAuth, getCourse);

// Protected routes - all users
router.get('/user/enrolled', protect, getEnrolledCourses);
router.post('/:id/enroll', protect, enrollCourse);
router.put('/:id/progress', protect, updateProgress);

// Protected routes - instructor/admin
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  enrollCourse,
  getTrendingCourses,
  getPersonalizedRecommendations
};
