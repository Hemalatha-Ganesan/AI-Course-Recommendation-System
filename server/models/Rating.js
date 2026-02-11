// const mongoose = require("mongoose");

// const ratingSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
//   rating: { type: Number, min: 1, max: 5, required: true },
//   review: { type: String },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Rating", ratingSchema);

const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  review: {
    type: String,
    maxlength: [500, 'Review cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// One rating per user per course
ratingSchema.index({ course: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);