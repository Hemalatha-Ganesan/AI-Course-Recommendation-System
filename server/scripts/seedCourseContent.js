const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');
const CourseContent = require('../models/CourseContent');

dotenv.config({ path: './.env' });

const sampleCourseContent = [
  {
    title: 'Introduction to the Course',
    lessons: [
      {
        title: 'Welcome to the Course',
        description: 'Get started with an overview of what you will learn',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDuration: 2,
        content: 'Welcome to this course! In this lesson, we will introduce you to the course structure and what you can expect to learn.',
        materials: [],
        referenceLinks: [],
        isFree: true
      },
      {
        title: 'Course Overview',
        description: 'Learn about the course structure and objectives',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDuration: 3,
        content: 'This course is designed to take you from beginner to expert level.',
        materials: [],
        referenceLinks: [],
        isFree: true
      }
    ]
  },
  {
    title: 'Getting Started',
    lessons: [
      {
        title: 'Setting Up Your Environment',
        description: 'Install and configure necessary tools',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDuration: 5,
        content: 'Before we start coding, lets set up our development environment properly.',
        materials: [
          { title: 'Setup Guide PDF', url: '#' }
        ],
        referenceLinks: [
          { title: 'Official Documentation', url: 'https://example.com' }
        ],
        isFree: true
      },
      {
        title: 'Your First Program',
        description: 'Write and run your first program',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDuration: 8,
        content: 'Now lets write our first program and see how it works.',
        materials: [],
        referenceLinks: [],
        isFree: false
      }
    ]
  },
  {
    title: 'Core Concepts',
    lessons: [
      {
        title: 'Understanding Variables',
        description: 'Learn about variables and data types',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDuration: 10,
        content: 'Variables are containers for storing data values.',
        materials: [],
        referenceLinks: [],
        isFree: false
      },
      {
        title: 'Functions and Methods',
        description: 'Create reusable code with functions',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDuration: 12,
        content: 'Functions are blocks of code designed to perform a particular task.',
        materials: [],
        referenceLinks: [],
        isFree: false
      },
      {
        title: 'Object-Oriented Programming',
        description: 'Introduction to OOP concepts',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDuration: 15,
        content: 'OOP is a programming paradigm based on the concept of objects.',
        materials: [],
        referenceLinks: [],
        isFree: false
      }
    ]
  },
  {
    title: 'Advanced Topics',
    lessons: [
      {
        title: 'Working with Databases',
        description: 'Connect and interact with databases',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDuration: 20,
        content: 'Learn how to connect your application to databases.',
        materials: [],
        referenceLinks: [],
        isFree: false
      },
      {
        title: 'Deployment',
        description: 'Deploy your application to production',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDuration: 18,
        content: 'Deploy your application to various platforms.',
        materials: [],
        referenceLinks: [],
        isFree: false
      }
    ]
  }
];

async function seedCourseContent() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai_course_recommendation');
    console.log('Connected to MongoDB');

    // Get all published courses
    const courses = await Course.find({ isPublished: true });
    console.log(`Found ${courses.length} published courses`);

    if (courses.length === 0) {
      console.log('No courses found. Please seed courses first.');
      process.exit(1);
    }

    // Add content to each course
    for (const course of courses) {
      // Check if content already exists
      const existingContent = await CourseContent.findOne({ course: course._id });
      
      if (existingContent) {
        console.log(`Content already exists for course: ${course.title}`);
        continue;
      }

      // Create content with sample data
      const content = await CourseContent.create({
        course: course._id,
        sections: sampleCourseContent
      });

      console.log(`Added content to course: ${course.title}`);
    }

    console.log('Course content seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding course content:', error);
    process.exit(1);
  }
}

seedCourseContent();

