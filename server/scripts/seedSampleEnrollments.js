const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Enrollment = require('../models/Enrollment');
const Useractivity = require('../models/Useractivity');
const Course = require('../models/Course');
const User = require('../models/User');

dotenv.config({ path: './../../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_course_recommendation';

async function seedSampleEnrollments() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🌱 Seeding sample enrollments + progress for demo');

    // Find user (hemalatha or first user)
const users = await User.find({ role: { $ne: 'admin' } }).limit(2);
    let user = users[0];
    if (!user) {
      console.log('❌ No non-admin users found! Create a user first.');
      process.exit(1);
    }
    console.log(`👤 Seeding for user: ${user.username} (${user.email})`);
    console.log(`👤 Using user: ${user.username} (${user.email})`);

    // Get first 3 published courses
    const courses = await Course.find({isPublished: true}).limit(3);
    console.log(`📚 Found ${courses.length} courses`);

    for (const course of courses) {
      // Delete existing enrollment
      await Enrollment.deleteOne({student: user._id, course: course._id});

      // Create enrollment with progress
      const enrollment = await Enrollment.create({
        student: user._id,
        course: course._id,
        progress: 35 + Math.floor(Math.random() * 30), // 35-65%
        lastAccessedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // last week
      });

      // Add user activity
      await Useractivity.create({
        user: user._id,
        course: course._id,
        activityType: 'lesson_completed',
        timeSpent: Math.floor(Math.random() * 120) + 30, // 30-150 min
        rating: Math.random() > 0.5 ? 4 + Math.random() : null
      });

console.log(`✅ Enrolled "${course.title}" (${course.category}) - ${enrollment.progress}% progress`);
    }

    console.log('🎉 Sample enrollments + progress seeded!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

seedSampleEnrollments();

