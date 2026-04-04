


const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Rating = require('../models/Rating');
const Useractivity = require('../models/Useractivity');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, isActive } = req.query;
  
  const query = {};
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const users = await User.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .sort('-createdAt');
  
  const total = await User.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin or Own Profile
exports.getUser = asyncHandler(async (req, res) => {
  // Check if user is accessing their own profile or is admin
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this user'
    });
  }
  
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin or Own Profile
exports.updateUser = asyncHandler(async (req, res) => {
  // Check if user is updating their own profile or is admin
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this user'
    });
  }
  
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Fields that can be updated
  const allowedUpdates = ['profile', 'preferences'];
  
  // If admin, allow role update
  if (req.user.role === 'admin') {
    allowedUpdates.push('role', 'isActive');
  }
  
  // Filter req.body to only allowed fields
  const updates = {};
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });
  
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    data: updatedUser
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  await user.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user learning stats for profile
// @route   GET /api/users/:id/stats
// @access  Private/Own
exports.getProfileStats = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ success: false, message: 'Own profile only' });
  }

  // Real enrollments
  const enrollments = await Enrollment.find({ student: req.params.id })
    .populate('course', 'title category level');
  
  // Real activity
  const activities = await Useractivity.find({ user: req.params.id })
    .populate('course', 'category');

  // Real calculations
  const completedCourses = enrollments.filter(e => e.completed).length;
  const totalEnrollments = enrollments.length;
  const totalStudyHours = Math.round(activities.reduce((sum, a) => sum + (a.timeSpent || 0), 0) / 60);
  const avgRating = activities.filter(a => a.rating).reduce((sum, a) => sum + a.rating, 0) / activities.filter(a => a.rating).length || 0;

  // Streak: consecutive days with activity
  const dates = [...new Set(activities.map(a => a.timestamp.toISOString().split('T')[0]))].sort();
  let streak = 1, maxStreak = 1;
  for (let i = 1; i < dates.length; i++) {
    if (dates[i] === new Date(dates[i-1].getTime() + 86400000).toISOString().split('T')[0]) {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 1;
    }
  }

  // Achievements (milestones)
  const achievements = [
    totalEnrollments >= 5 && '5+ Courses',
    totalStudyHours >= 50 && '50+ Hours',
    completedCourses >= 3 && '3+ Completed',
    avgRating >= 4.5 && 'Great Learner',
    maxStreak >= 7 && 'Week Streak'
  ].filter(Boolean).length;

  // Category breakdown
  const categoryHours = {};
  activities.forEach(a => {
    const cat = a.course?.category || 'Other';
    categoryHours[cat] = (categoryHours[cat] || 0) + (a.timeSpent || 5); // default 5min
  });

  res.json({
    success: true,
    stats: {
      coursesCompleted: completedCourses,
      totalStudyHours,
      currentStreak: streak,
      longestStreak: maxStreak,
      achievements,
      avgRating: avgRating.toFixed(1),
      totalActivities: activities.length,
      categoryBreakdown: Object.entries(categoryHours)
        .map(([cat, hrs]) => ({ category: cat, hours: Math.round(hrs/60), percentage: Math.round((hrs / activities.reduce((s, a) => s + (a.timeSpent || 5), 0)) * 100) }))
        .sort((a, b) => b.hours - a.hours)
        .slice(0, 4)
    }
  });
});

// @desc    Get user learning analytics
// @route   GET /api/users/:id/analytics
// @access  Private/Own Profile
exports.getUserAnalytics = asyncHandler(async (req, res) => {
  // Check authorization
  if (req.user.id !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access these analytics'
    });
  }
  
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));
  
  // Get enrollments
  const enrollments = await Enrollment.find({ 
    user: req.params.id,
    enrolledAt: { $gte: startDate }
  }).populate('course', 'title category level');
  
  // Get activities
  const activities = await Useractivity.find({
    user: req.params.id,
    timestamp: { $gte: startDate }
  });
  
  // Calculate learning patterns
  const categoryDistribution = {};
  enrollments.forEach(enrollment => {
    const category = enrollment.course?.category || 'Other';
    categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
  });
  
  // Activity by day of week
  const activityByDay = {
    Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0,
    Thursday: 0, Friday: 0, Saturday: 0
  };
  
  activities.forEach(activity => {
    const day = new Date(activity.timestamp).toLocaleDateString('en-US', { weekday: 'long' });
    activityByDay[day]++;
  });
  
  // Activity by time of day
  const activityByTime = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0
  };
  
  activities.forEach(activity => {
    const timeOfDay = activity.contextFeatures?.timeOfDay || 'unknown';
    if (activityByTime[timeOfDay] !== undefined) {
      activityByTime[timeOfDay]++;
    }
  });
  
  // Learning streak
  const uniqueDates = [...new Set(activities.map(a => 
    a.timestamp.toISOString().split('T')[0]
  ))].sort();
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
    
    if (dayDiff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  
  longestStreak = Math.max(longestStreak, tempStreak);
  
  // Check current streak
  if (uniqueDates.length > 0) {
    const lastActivityDate = new Date(uniqueDates[uniqueDates.length - 1]);
    const today = new Date();
    const daysSinceLastActivity = (today - lastActivityDate) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastActivity <= 1) {
      currentStreak = tempStreak;
    }
  }
  
  res.status(200).json({
    success: true,
    data: {
      period: `${days} days`,
      categoryDistribution,
      activityByDay,
      activityByTime,
      streak: {
        current: currentStreak,
        longest: longestStreak
      },
      totalActivities: activities.length,
      totalTimeSpent: activities.reduce((sum, a) => sum + (a.duration || 0), 0),
      averageDailyActivities: activities.length / parseInt(days)
    }
  });
});

// @desc    Get user's learning history
// @route   GET /api/users/:id/history
// @access  Private/Own Profile
exports.getLearningHistory = asyncHandler(async (req, res) => {
  // Check authorization
  if (req.user.id !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this history'
    });
  }
  
  const { page = 1, limit = 20, activityType } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const query = { user: req.params.id };
  if (activityType) query.activityType = activityType;
  
  const activities = await Useractivity.find(query)
    .populate('course', 'title thumbnail category')
    .sort('-timestamp')
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await Useractivity.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: activities.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: activities
  });
});

module.exports = exports;