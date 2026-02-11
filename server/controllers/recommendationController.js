// controllers/recommendationController.js
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Rating = require('../models/Rating');
const Useractivity = require('../models/Useractivity');
const Recommendation = require('../models/Recommendation');

// Get personalized recommendations for a user
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    // Check if we have cached recommendations
    const cachedRecommendations = await Recommendation.findOne({
      user: userId,
      expiresAt: { $gt: new Date() }
    }).populate('recommendedCourses.course');

    if (cachedRecommendations) {
      return res.status(200).json({
        success: true,
        data: cachedRecommendations.recommendedCourses.slice(0, limit),
        cached: true
      });
    }

    // Generate new recommendations
    const recommendations = await generateRecommendations(userId, limit);

    // Cache the recommendations
    await Recommendation.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        recommendedCourses: recommendations,
        generatedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      data: recommendations,
      cached: false
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error.message
    });
  }
};

// Get recommendations based on a specific course
exports.getCourseBasedRecommendations = async (req, res) => {
  try {
    const { courseId } = req.params;
    const limit = parseInt(req.query.limit) || 6;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const recommendations = await getSimilarCourses(course, limit);

    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course recommendations',
      error: error.message
    });
  }
};

// Get recommendations based on category and difficulty
exports.getRecommendationsByFilters = async (req, res) => {
  try {
    const { category, difficulty, courseId } = req.body;
    const limit = parseInt(req.query.limit) || 10;

    // Build query
    let query = { isPublished: true };
    
    if (category) {
      query.category = category;
    }
    
    if (difficulty) {
      query.level = difficulty;
    }

    // Exclude the current course if provided
    if (courseId) {
      query._id = { $ne: courseId };
    }

    // Get courses matching criteria
    let recommendations = await Course.find(query)
      .populate('instructor', 'name email')
      .sort({ rating: -1, enrollmentCount: -1 })
      .limit(limit);

    // If not enough courses found, broaden the search
    if (recommendations.length < limit) {
      const remainingLimit = limit - recommendations.length;
      const excludeIds = recommendations.map(c => c._id);
      if (courseId) excludeIds.push(courseId);

      const additionalCourses = await Course.find({
        _id: { $nin: excludeIds },
        isPublished: true,
        ...(category && { category })
      })
        .populate('instructor', 'name email')
        .sort({ rating: -1, enrollmentCount: -1 })
        .limit(remainingLimit);

      recommendations = [...recommendations, ...additionalCourses];
    }

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error.message
    });
  }
};

// Get trending courses
exports.getTrendingCourses = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - 30); // Last 30 days

    // Get courses with most recent enrollments
    const trendingCourses = await Enrollment.aggregate([
      {
        $match: {
          enrolledAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: '$course',
          enrollmentCount: { $sum: 1 }
        }
      },
      {
        $sort: { enrollmentCount: -1 }
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: '$course'
      },
      {
        $match: {
          'course.isPublished': true
        }
      },
      {
        $replaceRoot: { newRoot: '$course' }
      }
    ]);

    await Course.populate(trendingCourses, {
      path: 'instructor',
      select: 'name email'
    });

    res.status(200).json({
      success: true,
      count: trendingCourses.length,
      data: trendingCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trending courses',
      error: error.message
    });
  }
};

// Helper function to generate personalized recommendations
async function generateRecommendations(userId, limit) {
  const recommendations = [];
  const usedCourseIds = new Set();

  // 1. Get user's enrolled courses
  const enrollments = await Enrollment.find({ student: userId })
    .populate('course')
    .select('course');
  
  const enrolledCourses = enrollments.map(e => e.course).filter(c => c);
  enrolledCourses.forEach(c => usedCourseIds.add(c._id.toString()));

  // 2. Get courses similar to enrolled courses (40% weight)
  if (enrolledCourses.length > 0) {
    for (const enrolledCourse of enrolledCourses) {
      const similar = await getSimilarCourses(enrolledCourse, 3, usedCourseIds);
      similar.forEach(course => {
        if (!usedCourseIds.has(course._id.toString())) {
          recommendations.push({
            course: course,
            score: 40,
            reason: 'similar_to_enrolled'
          });
          usedCourseIds.add(course._id.toString());
        }
      });
    }
  }

  // 3. Get highly rated courses in user's preferred categories (30% weight)
  if (enrolledCourses.length > 0) {
    const categories = [...new Set(enrolledCourses.map(c => c.category))];
    const highlyRated = await Course.find({
      category: { $in: categories },
      _id: { $nin: Array.from(usedCourseIds) },
      isPublished: true,
      rating: { $gte: 4 }
    })
      .populate('instructor', 'name email')
      .sort({ rating: -1, numReviews: -1 })
      .limit(5);

    highlyRated.forEach(course => {
      if (!usedCourseIds.has(course._id.toString())) {
        recommendations.push({
          course: course,
          score: 30,
          reason: 'highly_rated'
        });
        usedCourseIds.add(course._id.toString());
      }
    });
  }

  // 4. Get trending courses (20% weight)
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - 30);
  
  const trending = await Enrollment.aggregate([
    { $match: { enrolledAt: { $gte: daysAgo } } },
    { $group: { _id: '$course', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  const trendingIds = trending.map(t => t._id);
  const trendingCourses = await Course.find({
    _id: { $in: trendingIds, $nin: Array.from(usedCourseIds) },
    isPublished: true
  }).populate('instructor', 'name email');

  trendingCourses.forEach(course => {
    if (!usedCourseIds.has(course._id.toString())) {
      recommendations.push({
        course: course,
        score: 20,
        reason: 'trending'
      });
      usedCourseIds.add(course._id.toString());
    }
  });

  // 5. Popular courses in general (10% weight)
  const popular = await Course.find({
    _id: { $nin: Array.from(usedCourseIds) },
    isPublished: true
  })
    .populate('instructor', 'name email')
    .sort({ enrolledStudents: -1, rating: -1 })
    .limit(5);

  popular.forEach(course => {
    if (!usedCourseIds.has(course._id.toString())) {
      recommendations.push({
        course: course,
        score: 10,
        reason: 'popular_in_category'
      });
      usedCourseIds.add(course._id.toString());
    }
  });

  // Sort by score and return top N
  recommendations.sort((a, b) => b.score - a.score);
  return recommendations.slice(0, limit);
}

// Helper function to get similar courses
async function getSimilarCourses(course, limit = 6, excludeIds = new Set()) {
  const excludeArray = Array.from(excludeIds).concat([course._id]);

  // Find courses with same category and similar level
  const similarCourses = await Course.find({
    _id: { $nin: excludeArray },
    category: course.category,
    isPublished: true
  })
    .populate('instructor', 'name email')
    .sort({ rating: -1 })
    .limit(limit);

  // If not enough similar courses, add courses from same category
  if (similarCourses.length < limit) {
    const additional = await Course.find({
      _id: { 
        $nin: [...excludeArray, ...similarCourses.map(c => c._id)] 
      },
      category: course.category,
      isPublished: true
    })
      .populate('instructor', 'name email')
      .sort({ rating: -1 })
      .limit(limit - similarCourses.length);

    return [...similarCourses, ...additional];
  }

  return similarCourses;
}

module.exports = exports;