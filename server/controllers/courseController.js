const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Rating = require('../models/Rating');
const User = require('../models/User');
const { sendEnrollmentEmail } = require('../utils/email');
const { asyncHandler } = require('../middleware/errorMiddleware');

const toCourseResponse = (courseDoc, enrollment = null) => {
  const course = courseDoc.toObject ? courseDoc.toObject() : courseDoc;

  return {
    ...course,
    difficulty: course.level,
    imageUrl: course.thumbnail,
    enrolledCount: Array.isArray(course.enrolledStudents)
      ? course.enrolledStudents.length
      : 0,
    instructor:
      typeof course.instructor === 'object' && course.instructor !== null
        ? course.instructor.username || course.instructor.name || 'Instructor'
        : course.instructor,
    progress: enrollment?.progress || 0,
    completed: enrollment?.completed || false,
    lastAccessedAt: enrollment?.lastAccessedAt || null,
    enrolledAt: enrollment?.enrolledAt || null
  };
};

// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public (optional auth)
const getAllCourses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filters = { isPublished: true };
  if (req.query.category) filters.category = req.query.category;
  if (req.query.search) {
    filters.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const coursesPromise = Course.find(filters)
    .populate('instructor', 'username name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Course.countDocuments(filters);

  const courses = await coursesPromise;

  res.json({
    success: true,
    count: courses.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: courses.map(course => toCourseResponse(course))
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'username name email')
    .populate({
      path: 'reviews',
      populate: { path: 'user', select: 'username' }
    });

  if (!course || !course.isPublished) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  let enrollment = null;
  if (req.user) {
    enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: course._id
    }).populate('course', 'title');
  }

  res.json({
    success: true,
    data: toCourseResponse(course, enrollment)
  });
});

// @desc    Get course categories
// @route   GET /api/courses/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Course.distinct('category', { isPublished: true });
  res.json({
    success: true,
    data: categories.sort()
  });
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (instructor/admin)
const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create({
    ...req.body,
    instructor: req.user._id,
    enrolledStudents: []
  });

  res.status(201).json({
    success: true,
    data: course
  });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (instructor/admin)
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  if (course.instructor.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized'
    });
  }

  Object.assign(course, req.body);
  await course.save();

  res.json({
    success: true,
    data: course
  });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (instructor/admin)
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  if (course.instructor.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized'
    });
  }

  course.isPublished = false;
  course.deleted = true;
  await course.save();

  res.json({
    success: true,
    message: 'Course deleted'
  });
});

// @desc    Get user's enrolled courses
// @route   GET /api/courses/user/enrolled
// @access  Private
const getEnrolledCourses = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate('course')
    .sort({ enrolledAt: -1 });

  const courses = enrollments.map(enrollment => 
    toCourseResponse(enrollment.course, enrollment)
  );

  res.json({
    success: true,
    data: courses
  });
});

// @desc    Update course progress
// @route   PUT /api/courses/:id/progress
// @access  Private
const updateProgress = asyncHandler(async (req, res) => {
  const { progress, completed, lastAccessedAt } = req.body;

  const enrollment = await Enrollment.findOneAndUpdate(
    { student: req.user._id, course: req.params.id },
    { progress, completed, lastAccessedAt },
    { new: true, runValidators: true }
  );

  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }

  res.json({
    success: true,
    data: enrollment
  });
});

// @desc    Get trending courses
// @route   GET /api/courses/trending
// @access  Public
const getTrendingCourses = asyncHandler(async (req, res) => {
  const pipeline = [
    { $match: { isPublished: true } },
    {
      $addFields: {
        score: { 
          $add: [
            { $size: '$enrolledStudents' },
            { $avg: { $ifNull: ['$ratings.avgRating', 0] } },
            { $divide: [{ $size: '$enrolledStudents' }, 10] }
          ]
        }
      }
    },
    { $sort: { score: -1, createdAt: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'users', localField: 'instructor', foreignField: '_id', as: 'instructor', pipeline: [{ $project: { username: 1, name: 1 } }] } },
    { $unwind: { path: '$instructor', preserveNullAndEmptyArrays: true } }
  ];

  const courses = await Course.aggregate(pipeline);
  
  res.json({
    success: true,
    data: courses.map(course => toCourseResponse(course))
  });
});

// @desc    Get total courses count
// @route   GET /api/courses/count
// @access  Public
const getTotalCoursesCount = asyncHandler(async (req, res) => {
  const count = await Course.countDocuments({ isPublished: true });
  res.json({
    success: true,
    data: count
  });
});

// @desc    Enroll user in a course (existing)
const enrollCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'username email');

  if (!course || !course.isPublished) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  const existingEnrollment = await Enrollment.findOne({
    student: req.user._id,
    course: course._id
  });

  if (existingEnrollment) {
    return res.status(400).json({
      success: false,
      message: 'You are already enrolled in this course'
    });
  }

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: course._id
  });

  await Course.findByIdAndUpdate(course._id, {
    $addToSet: { enrolledStudents: req.user._id }
  });

  // Send welcome email
  try {
    const user = await User.findById(req.user._id).select('username email');
    await sendEnrollmentEmail(user.email, user.username, toCourseResponse(course));
    console.log(`📧 Welcome email sent to ${user.email} for \"${course.title}\"`);
  } catch (emailError) {
    console.error('Email failed:', emailError.message);
  }

  res.status(201).json({
    success: true,
    message: 'Enrolled successfully! Welcome email sent.',
    data: enrollment
  });
});

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses,
  updateProgress,
  getCategories,
  getTotalCoursesCount,
  getTrendingCourses
};
