// routes/recommendationRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getRecommendations,
  getCourseBasedRecommendations,
  getRecommendationsByFilters,
  getTrendingCourses
} = require('../controllers/recommendationController');

// Get personalized recommendations for logged-in user
router.get('/personalized', authMiddleware, getRecommendations);

// Get recommendations based on specific course
router.get('/course/:courseId', getCourseBasedRecommendations);

// Get recommendations by category and difficulty
router.post('/filters', getRecommendationsByFilters);

// Get trending courses
router.get('/trending', getTrendingCourses);

module.exports = router;