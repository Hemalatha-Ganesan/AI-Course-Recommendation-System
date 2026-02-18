const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Useractivity = require('../models/Useractivity');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin stats - comprehensive dashboard statistics
exports.getAdminStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const activeCourses = await Course.countDocuments({ isPublished: true });
    
    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get recent enrollments (last 30 days)
    const newEnrollmentsThisMonth = await Enrollment.countDocuments({
      enrolledAt: { $gte: thirtyDaysAgo }
    });
    
    // Calculate percentage changes (simplified - you can enhance this)
    const previousMonthUsers = totalUsers - newUsersThisMonth;
    const userGrowthPercent = previousMonthUsers > 0 
      ? ((newUsersThisMonth / previousMonthUsers) * 100).toFixed(1)
      : 0;
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalCourses,
        activeCourses,
        totalEnrollments,
        newUsersThisMonth,
        newEnrollmentsThisMonth,
        userGrowthPercent: parseFloat(userGrowthPercent)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get recent history/activity
exports.getRecentHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    // Get recent enrollments
    const recentEnrollments = await Enrollment.find()
      .populate('student', 'username email')
      .populate('course', 'title thumbnail')
      .sort('-enrolledAt')
      .limit(limit);
    
    // Get recent user registrations
    const recentUsers = await User.find()
      .select('-password')
      .sort('-createdAt')
      .limit(10);
    
    // Get recently created courses
    const recentCourses = await Course.find()
      .populate('instructor', 'username email')
      .sort('-createdAt')
      .limit(10);
    
    // Format recent history
    const history = [];
    
    // Add enrollments to history
    recentEnrollments.forEach(enrollment => {
      history.push({
        type: 'enrollment',
        user: enrollment.student ? {
          name: enrollment.student.username,
          email: enrollment.student.email
        } : null,
        course: enrollment.course ? {
          title: enrollment.course.title,
          thumbnail: enrollment.course.thumbnail
        } : null,
        action: 'enrolled in',
        timestamp: enrollment.enrolledAt,
        _id: enrollment._id
      });
    });
    
    // Add new user registrations
    recentUsers.forEach(user => {
      history.push({
        type: 'registration',
        user: {
          name: user.username,
          email: user.email
        },
        action: 'joined the platform',
        timestamp: user.createdAt,
        _id: user._id
      });
    });
    
    // Add new courses
    recentCourses.forEach(course => {
      history.push({
        type: 'course_created',
        instructor: course.instructor ? {
          name: course.instructor.username,
          email: course.instructor.email
        } : null,
        course: {
          title: course.title,
          thumbnail: course.thumbnail
        },
        action: 'created course',
        timestamp: course.createdAt,
        _id: course._id
      });
    });
    
    // Sort by timestamp (most recent first)
    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Return top N items
    res.json({
      success: true,
      count: history.slice(0, limit).length,
      data: history.slice(0, limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all courses for admin
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'username email')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
