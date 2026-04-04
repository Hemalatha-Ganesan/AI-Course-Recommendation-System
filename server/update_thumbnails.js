const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config({path: '.env'});

async function updateThumbnails() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const courses = await Course.find({isPublished: true, $or: [{thumbnail: ''}, {thumbnail: null}, {thumbnail: {$exists: false}}] });
    console.log(`Found ${courses.length} courses without thumbnails. Updating...`);

    for (let course of courses) {
      course.thumbnail = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=500&fit=crop&ixlib=rb-4.0.3&q=80&cat=${course.category?.toLowerCase().replace(/ & /g, '') || 'education'}`;
      await course.save();
      console.log(`Updated: ${course.title.substring(0,50)}...`);
    }

    console.log('✅ All thumbnails updated!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updateThumbnails();

