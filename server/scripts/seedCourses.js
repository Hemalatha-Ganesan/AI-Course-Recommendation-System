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
        thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop',
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
        thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop',
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
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
        isPublished: true,
      },
      {
        title: 'React Modern Web Development',
        description: 'Build dynamic web applications with React, hooks, and modern patterns.',
        instructor: instructor._id,
        category: 'Development',
        level: 'Intermediate',
        price: 179,
        duration: 45,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop',
        isPublished: true,
      },
      {
        title: 'UI/UX Design Masterclass',
        description: 'Learn user interface and experience design principles with Figma.',
        instructor: instructor._id,
        category: 'Design',
        level: 'Beginner',
        price: 89,
        duration: 30,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
        isPublished: true,
      },
      {
        title: 'Digital Marketing Strategy',
        description: 'Master digital marketing with SEO, social media, and content marketing.',
        instructor: instructor._id,
        category: 'Marketing',
        level: 'Beginner',
        price: 79,
        duration: 25,
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
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

