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
  getTrendingCourses,
  getTotalCoursesCount
} = require('../controllers/courseController');
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, getAllCourses);
router.get('/categories', getCategories);
router.get('/count', getTotalCoursesCount);
router.get('/trending', getTrendingCourses);

router.get('/user/enrolled', protect, getEnrolledCourses);
router.post('/:id/enroll', protect, enrollCourse);
router.put('/:id/progress', protect, updateProgress);

router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

router.get('/:id', optionalAuth, getCourse);

module.exports = router;

