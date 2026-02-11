const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Useractivity = require('../models/Useractivity');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = asyncHandler(async (req, res) => {
  // Filter options
  const {
    category,
    level,
    minRating,
    maxPrice,
    search,
    sort = '-createdAt',
    page = 1,
    limit = 12
  } = req.query;
  
  // Build query
  const query = { isPublished: true };
  
  if (category) query.category = category;
  if (level) query.level = level;
  if (minRating) query['stats.averageRating'] = { $gte: parseFloat(minRating) };
  if (maxPrice) query['price.amount'] = { $lte: parseFloat(maxPrice) };
  if (search) {
    query.$text = { $search: search };
  }
  
  // Execute query with pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const courses = await Course.find(query)
    .populate('instructor', 'username profile.firstName profile.lastName profile.avatar')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));
  
  // Get total count for pagination
  const total = await Course.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: courses.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: courses
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'username profile email');
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  // Log activity if user is authenticated
  if (req.user) {
    await Useractivity.logActivity({
      user: req.user._id,
      activityType: 'course-view',
      course: course._id,
      details: {
        viewDuration: 0
      }
    });
  }
  
  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
exports.createCourse = asyncHandler(async (req, res) => {
  // Add instructor as the logged in user
  req.body.instructor = req.user.id;
  
  const course = await Course.create(req.body);
  
  res.status(201).json({
    success: true,
    data: course
  });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
exports.updateCourse = asyncHandler(async (req, res) => {
  let course = await Course.findById(req.params.id);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  // Check if user is course instructor or admin
  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this course'
    });
  }
  
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  // Check if user is course instructor or admin
  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this course'
    });
  }
  
  await course.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
exports.enrollCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  if (!course.isPublished) {
    return res.status(400).json({
      success: false,
      message: 'Cannot enroll in unpublished course'
    });
  }
  
  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    user: req.user.id,
    course: req.params.id
  });
  
  if (existingEnrollment) {
    return res.status(400).json({
      success: false,
      message: 'Already enrolled in this course'
    });
  }
  
  // Create enrollment
  const enrollment = await Enrollment.create({
    user: req.user.id,
    course: req.params.id
  });
  
  // Update course stats
  course.stats.totalEnrollments += 1;
  await course.save();
  
  // Log activity
  await Useractivity.logActivity({
    user: req.user._id,
    activityType: 'course-enroll',
    course: course._id
  });
  
  res.status(201).json({
    success: true,
    data: enrollment
  });
});

// @desc    Get user's enrolled courses
// @route   GET /api/courses/enrolled
// @access  Private
exports.getEnrolledCourses = asyncHandler(async (req, res) => {
  const { status } = req.query;
  
  const query = { user: req.user.id };
  if (status) query.status = status;
  
  const enrollments = await Enrollment.find(query)
    .populate({
      path: 'course',
      populate: {
        path: 'instructor',
        select: 'username profile'
      }
    })
    .sort('-enrolledAt');
  
  res.status(200).json({
    success: true,
    count: enrollments.length,
    data: enrollments
  });
});

// @desc    Update course progress
// @route   PUT /api/courses/:id/progress
// @access  Private
exports.updateProgress = asyncHandler(async (req, res) => {
  const { lectureId, sectionIndex, lectureIndex } = req.body;
  
  const enrollment = await Enrollment.findOne({
    user: req.user.id,
    course: req.params.id
  });
  
  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }
  
  // Add completed lecture if not already completed
  if (lectureId && !enrollment.progress.completedLectures.includes(lectureId)) {
    enrollment.progress.completedLectures.push(lectureId);
  }
  
  // Update current lecture
  if (sectionIndex !== undefined && lectureIndex !== undefined) {
    enrollment.progress.currentLecture = { sectionIndex, lectureIndex };
  }
  
  // Update progress percentage
  await enrollment.updateProgress();
  
  // Log activity
  await Useractivity.logActivity({
    user: req.user._id,
    activityType: 'lecture-complete',
    course: req.params.id,
    details: {
      lectureId,
      sectionIndex,
      lectureIndex
    }
  });
  
  res.status(200).json({
    success: true,
    data: enrollment
  });
});

// @desc    Get course categories
// @route   GET /api/courses/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Course.distinct('category', { isPublished: true });
  
  res.status(200).json({
    success: true,
    data: categories
  });
});

// @desc    Get trending courses
// @route   GET /api/courses/trending
// @access  Public
exports.getTrendingCourses = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  // Get courses with high enrollment and rating in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const courses = await Course.find({
    isPublished: true,
    publishedAt: { $gte: thirtyDaysAgo }
  })
    .populate('instructor', 'username profile')
    .sort('-stats.totalEnrollments -stats.averageRating')
    .limit(limit);
  
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

module.exports = exports;