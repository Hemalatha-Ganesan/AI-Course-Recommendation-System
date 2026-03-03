const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/courseai';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding courses');

    // find an existing user to use as instructor
    let instructor = await User.findOne();
    if (!instructor) {
      console.log('⚠️  No user found, creating temporary instructor');
      instructor = await User.create({
        username: 'instructor',
        email: 'instructor@test.com',
        password: 'password123',
        role: 'admin' // role doesn't matter for course creation
      });
    }

    const existing = await Course.findOne();
    if (existing) {
      console.log('ℹ️  Courses already exist, aborting seeding');
      process.exit(0);
    }

    const sampleCourses = [
      {
        title: 'Machine Learning Fundamentals',
        description: 'A beginner-friendly course on machine learning concepts and algorithms.',
        instructor: instructor._id,
        category: 'Development',
        level: 'Beginner',
        price: 149,
        duration: 40,
        thumbnail: '',
        isPublished: true,
      },
      {
        title: 'Web Development Bootcamp',
        description: 'Learn to build modern web applications using HTML, CSS, and JavaScript.',
        instructor: instructor._id,
        category: 'Development',
        level: 'Beginner',
        price: 99,
        duration: 60,
        thumbnail: '',
        isPublished: true,
      },
      {
        title: 'Data Science with Python',
        description: 'Analyze data and build models using Python libraries.',
        instructor: instructor._id,
        category: 'Development',
        level: 'Intermediate',
        price: 129,
        duration: 50,
        thumbnail: '',
        isPublished: true,
      }
    ];

    await Course.insertMany(sampleCourses);
    console.log('✅ Sample courses seeded');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding courses failed:', err);
    process.exit(1);
  }
}

seed();
