const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recommendedCourses: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    score: {
      type: Number,
      default: 0
    },
    reason: {
      type: String,
      enum: ['similar_to_enrolled', 'popular_in_category', 'highly_rated', 'trending', 'personalized']
    }
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 7*24*60*60*1000) // 7 days from now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Recommendation', recommendationSchema);