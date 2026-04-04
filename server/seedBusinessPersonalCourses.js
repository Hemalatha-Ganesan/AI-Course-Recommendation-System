const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/courseai';

async function seedBusinessPersonal() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB - Seeding Business & Personal Development courses');

    let instructor = await User.findOne({ role: 'admin' });
    if (!instructor) {
      instructor = await User.create({
        username: 'business_instructor',
        email: 'business@course.ai',
        password: 'password123',
        role: 'admin'
      });
    }

    const businessCourses = [
      { title: 'Strategic Business Management', description: 'Master strategic planning and execution', category: 'Business', level: 'Advanced', price: 159, duration: 45, rating: 4.7, thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500', isPublished: true },
      { title: 'Entrepreneurship Essentials', description: 'Launch your startup successfully', category: 'Business', level: 'Beginner', price: 99, duration: 28, rating: 4.6, thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', isPublished: true },
      { title: 'Financial Analysis & Modeling', description: 'Advanced Excel and financial modeling', category: 'Business', level: 'Intermediate', price: 179, duration: 38, rating: 4.8, thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500', isPublished: true },
      { title: 'Leadership Development Program', description: 'Develop executive leadership skills', category: 'Business', level: 'Advanced', price: 199, duration: 52, rating: 4.7, thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500', isPublished: true },
      { title: 'Digital Transformation Strategy', description: 'Lead your organization through digital change', category: 'Business', level: 'Advanced', price: 169, duration: 40, rating: 4.6, thumbnail: 'https://images.unsplash.com/photo-1518777668558-9f7d288cef84?w=500', isPublished: true },
      { title: 'Supply Chain Management Masterclass', description: 'Optimize global supply chains', category: 'Business', level: 'Intermediate', price: 149, duration: 35, rating: 4.5, thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500', isPublished: true },
      { title: 'HR Management & People Analytics', description: 'Data-driven HR strategies', category: 'Business', level: 'Intermediate', price: 139, duration: 32, rating: 4.6, thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500', isPublished: true }
    ];

    const personalCourses = [
      { title: 'Personal Productivity Mastery', description: 'Double your productivity', category: 'Personal Development', level: 'Beginner', price: 79, duration: 18, rating: 4.7, thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500', isPublished: true },
      { title: 'Public Speaking & Presentation Skills', description: 'Confident communication', category: 'Personal Development', level: 'Intermediate', price: 89, duration: 22, rating: 4.8, thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', isPublished: true },
      { title: 'Mindfulness & Emotional Intelligence', description: 'Master your emotions', category: 'Personal Development', level: 'Beginner', price: 69, duration: 15, rating: 4.6, thumbnail: 'https://images.unsplash.com/photo-1511285560929-80f3d231192c?w=500', isPublished: true },
      { title: 'Time Management for Professionals', description: 'Get more done in less time', category: 'Personal Development', level: 'Intermediate', price: 99, duration: 25, rating: 4.7, thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500', isPublished: true },
      { title: 'Personal Branding Masterclass', description: 'Build your professional brand', category: 'Personal Development', level: 'Advanced', price: 119, duration: 30, rating: 4.6, thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500', isPublished: true },
      { title: 'Goal Setting & Achievement Psychology', description: 'Science of success', category: 'Personal Development', level: 'All Levels', price: 89, duration: 20, rating: 4.8, thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500', isPublished: true },
      { title: 'Negotiation Skills for Success', description: 'Win-win negotiation strategies', category: 'Personal Development', level: 'Intermediate', price: 109, duration: 24, rating: 4.7, thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b7?w=500', isPublished: true }
    ];

    const allNewCourses = [...businessCourses, ...personalCourses].map(course => ({
      ...course,
      instructor: instructor._id
    }));

    const result = await Course.insertMany(allNewCourses);
    console.log(`✅ Seeded ${result.length} new courses (Business: ${businessCourses.length}, Personal Development: ${personalCourses.length})!`);

    const stats = await Course.aggregate([
      {$match: {isPublished: true}},
      {$group: {_id: '$category', count: {$sum: 1}}},
      {$sort: {count: -1}}
    ]);
    console.log('Updated category counts:', stats);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedBusinessPersonal();

