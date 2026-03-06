const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
  lessonId: {
    type: String, // Using string ID since we'll reference by lesson index
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  watchedDuration: {
    type: Number, // in seconds
    default: 0
  },
  completedAt: {
    type: Date
  },
  lastWatchedAt: {
    type: Date,
    default: Date.now
  }
});

const enrollmentProgressSchema = new mongoose.Schema({
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lessonProgress: [lessonProgressSchema],
  totalTimeSpent: {
    type: Number, // total seconds
    default: 0
  },
  overallProgress: {
    type: Number, // percentage 0-100
    default: 0
  },
  currentLesson: {
    sectionIndex: {
      type: Number,
      default: 0
    },
    lessonIndex: {
      type: Number,
      default: 0
    }
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index
enrollmentProgressSchema.index({ enrollment: 1 }, { unique: true });
enrollmentProgressSchema.index({ student: 1, course: 1 });

// Method to update lesson progress
enrollmentProgressSchema.methods.updateLessonProgress = async function(lessonId, watchedDuration, completed = false) {
  const existingProgress = this.lessonProgress.find(p => p.lessonId === lessonId);
  
  if (existingProgress) {
    existingProgress.watchedDuration = Math.max(existingProgress.watchedDuration, watchedDuration);
    existingProgress.lastWatchedAt = new Date();
    if (completed) {
      existingProgress.completed = true;
      existingProgress.completedAt = new Date();
    }
  } else {
    this.lessonProgress.push({
      lessonId,
      watchedDuration,
      completed,
      completedAt: completed ? new Date() : null,
      lastWatchedAt: new Date()
    });
  }
  
  // Update total time spent
  this.totalTimeSpent = this.lessonProgress.reduce((total, p) => total + p.watchedDuration, 0);
  this.lastAccessedAt = new Date();
  
  await this.save();
  return this;
};

// Method to calculate overall progress
enrollmentProgressSchema.methods.calculateProgress = async function(totalLessons) {
  if (totalLessons === 0) {
    this.overallProgress = 0;
  } else {
    const completedLessons = this.lessonProgress.filter(p => p.completed).length;
    this.overallProgress = Math.round((completedLessons / totalLessons) * 100);
  }
  
  if (this.overallProgress === 100 && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
  
  await this.save();
  return this;
};

module.exports = mongoose.model('EnrollmentProgress', enrollmentProgressSchema);

