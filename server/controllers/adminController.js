const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Useractivity = require('../models/Useractivity');

// Get all users with activity status
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    
    // Get enrollment data to determine activity status
    const enrollments = await Enrollment.find().populate('student', '_id');
    
    // Calculate last active for each user
    const usersWithActivity = users.map(user => {
      const userEnrollments = enrollments.filter(e => 
        e.student && e.student._id.toString() === user._id.toString()
      );
      
      // Find the most recent activity (lastAccessedAt or enrolledAt)
      let lastActive = null;
      if (userEnrollments.length > 0) {
        const dates = userEnrollments
          .map(e => e.lastAccessedAt || e.enrolledAt)
          .filter(d => d)
          .sort((a, b) => new Date(b) - new Date(a));
        lastActive = dates[0];
      }
      
      // Determine if active (activity in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const isActive = lastActive && new Date(lastActive) >= thirtyDaysAgo;
      
      return {
        ...user.toObject(),
        lastActive,
        isActive,
        totalEnrollments: userEnrollments.length,
        completedCourses: userEnrollments.filter(e => e.completed).length
      };
    });
    
    res.json({
      success: true,
      count: usersWithActivity.length,
      data: usersWithActivity
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get detailed students with courses and status
exports.getStudentsDetailed = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let match = {};
    if (status) match.isActive = status === 'active';
    if (search) {
      match.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Aggregate students with enrollments and courses
    const students = await User.aggregate([
      { $match: { ...match, role: { $ne: 'admin' } } },
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'student',
          as: 'enrollments',
          pipeline: [{
            $lookup: {
              from: 'courses',
              localField: 'course',
              foreignField: '_id',
              as: 'course',
              pipeline: [{ $project: { title: 1, category: 1, thumbnail: 1 } }]
            }
          }, {
            $addFields: {
              'course': { $arrayElemAt: ['$course', 0] }
            }
          }]
        }
      },
      {
        $addFields: {
          isActive: {
            $gt: [
              { $max: '$enrollments.lastAccessedAt' },
              { $dateSubtract: { startDate: '$$NOW', unit: 'day', amount: 30 } }
            ]
          },
          enrolledCoursesCount: { $size: '$enrollments' },
          completedCourses: {
            $size: { $filter: { input: '$enrollments', cond: '$$this.completed' } }
          }
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'enrollments.instructor',
          foreignField: '_id',
          as: 'instructors'
        }
      }
    ]);

    const total = await User.countDocuments({ role: { $ne: 'admin' }, ...match });

    res.json({
      success: true,
      count: students.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: students
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
    const totalEnrolledStudents = await Enrollment.distinct('student').length;
    const activeCourses = await Course.countDocuments({ isPublished: true });
    
    // Completion rate & learning rate
    const enrollments = await Enrollment.aggregate([
      { $group: { _id: null, total: { $sum: 1 }, completed: { $sum: { $toInt: '$completed' } } } }
    ]);
    const completionRate = enrollments[0] ? ((enrollments[0].completed / enrollments[0].total) * 100).toFixed(1) : 0;
    
    // Avg rating
    const ratings = await require('../models/Rating').aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);
    const avgRating = ratings[0] ? ratings[0].avg.toFixed(1) : 0;
    
    // Active users (activity last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await Useractivity.countDocuments({ timestamp: { $gte: thirtyDaysAgo } });
    
    // Top categories
    const topCategories = await Enrollment.aggregate([
      { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $group: { _id: '$course.category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Recent users & enrollments
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    const newEnrollmentsThisMonth = await Enrollment.countDocuments({
      enrolledAt: { $gte: thirtyDaysAgo }
    });
    
    // Growth
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
        activeUsers,
        completionRate,
        avgRating,
        topCategories,
        newUsersThisMonth,
        newEnrollmentsThisMonth,
        userGrowthPercent: parseFloat(userGrowthPercent),
        totalEnrolledStudents
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

// Create new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, level, price, duration, thumbnail, isPublished } = req.body;
    
    const course = await Course.create({
      title,
      description,
      category,
      level,
      price,
      duration,
      thumbnail: thumbnail || '',
      isPublished: Boolean(isPublished),
      instructor: req.user._id
    });
    
    const populatedCourse = await Course.findById(course._id).populate(
      'instructor',
      'username email'
    );
    
    res.status(201).json({
      success: true,
      data: populatedCourse
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, category, level, price, duration, thumbnail, isPublished } = req.body;
    
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    // Update fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (level) course.level = level;
    if (price !== undefined) course.price = price;
    if (duration) course.duration = duration;
    if (thumbnail) course.thumbnail = thumbnail;
    if (isPublished !== undefined) course.isPublished = isPublished;
    
    await course.save();
    
    const updatedCourse = await Course.findById(course._id).populate(
      'instructor',
      'username email'
    );
    
    res.json({
      success: true,
      data: updatedCourse
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get student leaderboard
exports.getStudentLeaderboard = async (req, res) => {
  try {
    const { limit = 10, metric = 'hours' } = req.query;
    
    const leaderboard = await User.aggregate([
      {
        $lookup: {
          from: 'useractivities',
          localField: '_id',
          foreignField: 'user',
          as: 'activities'
        }
      },
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'student',
          as: 'enrollments'
        }
      },
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'user',
          as: 'ratings'
        }
      },
      {
        $addFields: {
          totalHours: { $sum: '$activities.timeSpent' },
          completedCourses: {
            $size: {
              $filter: {
                input: '$enrollments',
                cond: { $eq: ['$$this.completed', true] }
              }
            }
          },
          avgRating: { $avg: '$ratings.rating' },
          totalCourses: { $size: '$enrollments' }
        }
      },
      {
        $match: { role: { $ne: 'admin' }, totalHours: { $gt: 0 } }
      },
      {
        $addFields: {
          sortMetric: metric === 'courses' ? '$completedCourses' : metric === 'rating' ? '$avgRating' : '$totalHours'
        }
      },
      {
        $sort: { sortMetric: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          username: 1,
          email: 1,
          totalHours: { $ifNull: ['$totalHours', 0] },
          completedCourses: { $ifNull: ['$completedCourses', 0] },
          avgRating: { $ifNull: ['$avgRating', 0] },
          totalCourses: { $ifNull: ['$totalCourses', 0] },
          rank: { $add: [ { $literal: 1 }, { $indexOfArray: [ [], '$_id' ] } ] }
        }
      }
    ]);

    // Simple JS ranking
    const ranked = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
    
    res.json({
      success: true,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    // Delete enrollments and ratings associated with the course
    await Promise.all([
      Enrollment.deleteMany({ course: req.params.id }),
      require('../models/Rating').deleteMany({ course: req.params.id }),
      Course.findByIdAndDelete(req.params.id)
    ]);
    
    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
