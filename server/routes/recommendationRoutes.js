// routes/recommendationRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getRecommendations,
  getCourseBasedRecommendations,
  getRecommendationsByFilters,
  getTrendingCourses,
  searchRecommendations
} = require('../controllers/recommendationController');

// Get personalized recommendations for logged-in user
router.get('/personalized', protect, getRecommendations);

// Search-based recommendations
router.get('/search', searchRecommendations);

// Get recommendations based on specific course
router.get('/course/:courseId', getCourseBasedRecommendations);

// Get recommendations by category and difficulty
router.post('/filters', getRecommendationsByFilters);

// Get trending courses
router.get('/trending', getTrendingCourses);

module.exports = router;
