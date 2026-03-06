const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Rating = require('../models/Rating');
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
    completed: enrollment?.completed || false
  };
};

// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public (optional auth)
exports.getAllCourses = asyncHandler(async (req, res) => {
  const { category, level, search, page = 1, limit = 20 } = req.query;

  const query = { isPublished: true };

  if (category) {
    query.category = category;
  }

  if (level) {
    query.level = level;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 20);
  const skip = (pageNum - 1) * limitNum;

  const [courses, total] = await Promise.all([
    Course.find(query)
      .populate('instructor', 'username email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum),
    Course.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: courses.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: courses.map((course) => toCourseResponse(course))
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public (optional auth)
exports.getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    'instructor',
    'username email'
  );

  if (!course) {
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
    });
  }

  res.status(200).json({
    success: true,
    enrolled: Boolean(enrollment),
    data: toCourseResponse(course, enrollment)
  });
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (instructor/admin)
exports.createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    level,
    price,
    duration,
    thumbnail,
    isPublished
  } = req.body;

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
    data: toCourseResponse(populatedCourse)
  });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (instructor/admin)
exports.updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  if (
    req.user.role !== 'admin' &&
    course.instructor.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this course'
    });
  }

  const updatableFields = [
    'title',
    'description',
    'category',
    'level',
    'price',
    'duration',
    'thumbnail',
    'isPublished'
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      course[field] = req.body[field];
    }
  });

  await course.save();

  const updatedCourse = await Course.findById(course._id).populate(
    'instructor',
    'username email'
  );

  res.status(200).json({
    success: true,
    data: toCourseResponse(updatedCourse)
  });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (instructor/admin)
exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  if (
    req.user.role !== 'admin' &&
    course.instructor.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this course'
    });
  }

  await Promise.all([
    Enrollment.deleteMany({ course: course._id }),
    Rating.deleteMany({ course: course._id }),
    Course.findByIdAndDelete(course._id)
  ]);

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully'
  });
});

// @desc    Enroll user in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
exports.enrollCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

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

  res.status(201).json({
    success: true,
    message: 'Enrolled successfully',
    data: enrollment
  });
});

// @desc    Get all courses enrolled by current user
// @route   GET /api/courses/user/enrolled
// @access  Private
exports.getEnrolledCourses = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({
      path: 'course',
      populate: { path: 'instructor', select: 'username email' }
    })
    .sort('-updatedAt');

  const courses = enrollments
    .filter((item) => item.course)
    .map((item) => toCourseResponse(item.course, item));

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
    courses
  });
});

// @desc    Update course progress for current user
// @route   PUT /api/courses/:id/progress
// @access  Private
exports.updateProgress = asyncHandler(async (req, res) => {
  const { progress, completed } = req.body;

  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.id
  });

  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found for this course'
    });
  }

  if (progress !== undefined) {
    const safeProgress = Math.max(0, Math.min(100, Number(progress)));
    enrollment.progress = Number.isNaN(safeProgress) ? enrollment.progress : safeProgress;
  }

  if (completed !== undefined) {
    enrollment.completed = Boolean(completed);
  }

  if (enrollment.progress >= 100) {
    enrollment.completed = true;
  }

  enrollment.completedAt = enrollment.completed ? new Date() : null;
  enrollment.lastAccessedAt = new Date();
  await enrollment.save();

  res.status(200).json({
    success: true,
    message: 'Progress updated successfully',
    data: enrollment
  });
});

// @desc    Get available categories
// @route   GET /api/courses/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Course.distinct('category', { isPublished: true });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get total courses count
// @route   GET /api/courses/count
// @access  Public
exports.getTotalCoursesCount = asyncHandler(async (req, res) => {
  const count = await Course.countDocuments({ isPublished: true });

  res.status(200).json({
    success: true,
    count
  });
});

// @desc    Get trending courses
// @route   GET /api/courses/trending
// @access  Public
exports.getTrendingCourses = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let courses = await Course.find({
    isPublished: true,
    createdAt: { $gte: thirtyDaysAgo }
  })
    .populate('instructor', 'username email')
    .sort('-rating -numReviews -createdAt')
    .limit(limit);

  if (!courses.length) {
    courses = await Course.find({ isPublished: true })
      .populate('instructor', 'username email')
      .sort('-rating -numReviews -createdAt')
      .limit(limit);
  }

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses.map((course) => toCourseResponse(course))
  });
});

module.exports = exports;
