const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  videoDuration: {
    type: Number, // in minutes
    default: 0
  },
  content: {
    type: String, // Text content/notes
    default: ''
  },
  materials: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'doc', 'link', 'other'],
      default: 'link'
    }
  }],
  referenceLinks: [{
    title: String,
    url: String
  }],
  order: {
    type: Number,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: false
  }
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  lessons: [lessonSchema]
});

const courseContentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  sections: [sectionSchema],
  totalDuration: {
    type: Number, // total minutes
    default: 0
  }
}, {
  timestamps: true
});

// Calculate total duration before saving
courseContentSchema.pre('save', async function() {
  let total = 0;
  this.sections.forEach(section => {
    section.lessons.forEach(lesson => {
      total += lesson.videoDuration || 0;
    });
  });
  this.totalDuration = total;
});

module.exports = mongoose.model('CourseContent', courseContentSchema);

