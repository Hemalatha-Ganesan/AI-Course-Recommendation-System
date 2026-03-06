const Course = require('../models/Course');
const CourseContent = require('../models/CourseContent');
const Enrollment = require('../models/Enrollment');
const EnrollmentProgress = require('../models/EnrollmentProgress');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get course content
// @route   GET /api/courses/:courseId/content
// @access  Private (enrolled students)
exports.getCourseContent = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  
  // Check if user is enrolled
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId
  });

  if (!enrollment) {
    return res.status(403).json({
      success: false,
      message: 'You must be enrolled to access course content'
    });
  }

  // Get course content
  let content = await CourseContent.findOne({ course: courseId });
  
  // If no content exists, create empty structure
  if (!content) {
    content = await CourseContent.create({
      course: courseId,
      sections: []
    });
  }

  // Get user progress
  let progress = await EnrollmentProgress.findOne({ enrollment: enrollment._id });
  
  // If no progress exists, create initial progress
  if (!progress) {
    progress = await EnrollmentProgress.create({
      enrollment: enrollment._id,
      student: req.user._id,
      course: courseId,
      lessonProgress: [],
      totalTimeSpent: 0,
      overallProgress: 0
    });
  }

  res.status(200).json({
    success: true,
    data: {
      content,
      progress: {
        overallProgress: progress.overallProgress,
        totalTimeSpent: progress.totalTimeSpent,
        currentLesson: progress.currentLesson,
        lessonProgress: progress.lessonProgress,
        isCompleted: progress.isCompleted,
        startedAt: progress.startedAt,
        lastAccessedAt: progress.lastAccessedAt
      }
    }
  });
});

// @desc    Get lesson content
// @route   GET /api/courses/:courseId/content/lessons/:sectionIndex/:lessonIndex
// @access  Private (enrolled students)
exports.getLessonContent = asyncHandler(async (req, res) => {
  const { courseId, sectionIndex, lessonIndex } = req.params;
  
  // Check if user is enrolled
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId
  });

  if (!enrollment) {
    return res.status(403).json({
      success: false,
      message: 'You must be enrolled to access lesson content'
    });
  }

  const content = await CourseContent.findOne({ course: courseId });
  
  if (!content || !content.sections[sectionIndex] || !content.sections[sectionIndex].lessons[lessonIndex]) {
    return res.status(404).json({
      success: false,
      message: 'Lesson not found'
    });
  }

  const lesson = content.sections[sectionIndex].lessons[lessonIndex];
  
  // Get user progress for this lesson
  const progress = await EnrollmentProgress.findOne({ enrollment: enrollment._id });
  const lessonProgress = progress?.lessonProgress.find(
    p => p.lessonId === `${sectionIndex}-${lessonIndex}`
  );

  // Update current lesson in progress
  if (progress) {
    progress.currentLesson = {
      sectionIndex: parseInt(sectionIndex),
      lessonIndex: parseInt(lessonIndex)
    };
    progress.lastAccessedAt = new Date();
    await progress.save();
  }

  res.status(200).json({
    success: true,
    data: {
      lesson,
      progress: lessonProgress || {
        completed: false,
        watchedDuration: 0
      }
    }
  });
});

// @desc    Update lesson progress
// @route   PUT /api/courses/:courseId/content/lessons/:sectionIndex/:lessonIndex/progress
// @access  Private (enrolled students)
exports.updateLessonProgress = asyncHandler(async (req, res) => {
  const { courseId, sectionIndex, lessonIndex } = req.params;
  const { watchedDuration, completed } = req.body;
  
  // Check if user is enrolled
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId
  });

  if (!enrollment) {
    return res.status(403).json({
      success: false,
      message: 'You must be enrolled to update progress'
    });
  }

  const content = await CourseContent.findOne({ course: courseId });
  
  if (!content || !content.sections[sectionIndex] || !content.sections[sectionIndex].lessons[lessonIndex]) {
    return res.status(404).json({
      success: false,
      message: 'Lesson not found'
    });
  }

  // Get or create progress
  let progress = await EnrollmentProgress.findOne({ enrollment: enrollment._id });
  
  if (!progress) {
    progress = await EnrollmentProgress.create({
      enrollment: enrollment._id,
      student: req.user._id,
      course: courseId,
      lessonProgress: [],
      totalTimeSpent: 0,
      overallProgress: 0
    });
  }

  const lessonId = `${sectionIndex}-${lessonIndex}`;
  
  // Update lesson progress
  await progress.updateLessonProgress(lessonId, watchedDuration || 0, completed);

  // Calculate total lessons
  let totalLessons = 0;
  content.sections.forEach(section => {
    totalLessons += section.lessons.length;
  });

  // Calculate overall progress
  await progress.calculateProgress(totalLessons);

  // Update enrollment progress as well
  enrollment.progress = progress.overallProgress;
  enrollment.completed = progress.isCompleted;
  enrollment.lastAccessedAt = new Date();
  await enrollment.save();

  res.status(200).json({
    success: true,
    message: 'Progress updated successfully',
    data: {
      overallProgress: progress.overallProgress,
      totalTimeSpent: progress.totalTimeSpent,
      lessonProgress: progress.lessonProgress
    }
  });
});

// @desc    Create or update course content (admin/instructor)
// @route   PUT /api/courses/:courseId/content
// @access  Private (admin/instructor)
exports.updateCourseContent = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const { sections } = req.body;

  // Check if course exists and user is authorized
  const course = await Course.findById(courseId);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Check authorization
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update course content'
    });
  }

  // Upsert course content
  const content = await CourseContent.findOneAndUpdate(
    { course: courseId },
    { course: courseId, sections },
    { new: true, upsert: true }
  );

  res.status(200).json({
    success: true,
    message: 'Course content updated successfully',
    data: content
  });
});

// @desc    Get enrolled courses with progress
// @route   GET /api/courses/user/learning
// @access  Private
exports.getMyLearning = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({
      path: 'course',
      populate: { path: 'instructor', select: 'username email' }
    })
    .sort('-lastAccessedAt');

  const coursesWithProgress = await Promise.all(
    enrollments.map(async (enrollment) => {
      if (!enrollment.course) return null;
      
      const progress = await EnrollmentProgress.findOne({ 
        enrollment: enrollment._id 
      });
      
      const content = await CourseContent.findOne({ 
        course: enrollment.course._id 
      });

      // Count total lessons
      let totalLessons = 0;
      let completedLessons = 0;
      
      if (content) {
        content.sections.forEach(section => {
          totalLessons += section.lessons.length;
        });
      }
      
      if (progress) {
        completedLessons = progress.lessonProgress.filter(p => p.completed).length;
      }

      return {
        ...enrollment.course.toObject(),
        enrollmentId: enrollment._id,
        progress: progress?.overallProgress || enrollment.progress || 0,
        totalTimeSpent: progress?.totalTimeSpent || 0,
        totalLessons,
        completedLessons,
        lastAccessedAt: progress?.lastAccessedAt || enrollment.lastAccessedAt,
        isCompleted: progress?.isCompleted || enrollment.completed
      };
    })
  );

  // Filter out null values
  const validCourses = coursesWithProgress.filter(c => c !== null);

  res.status(200).json({
    success: true,
    count: validCourses.length,
    data: validCourses
  });
});

module.exports = exports;

