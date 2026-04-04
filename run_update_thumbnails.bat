@echo off
cd /d server
echo Updating thumbnails for new courses...
node -e "
const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const courses = await Course.find({isPublished: true, thumbnail: ''});
  console.log(`Found ${courses.length} courses without thumbnails`);
  for (let course of courses) {
    course.thumbnail = `https://images.unsplash.com/photo-${Math.floor(Math.random()*1000)}?w=500&fit=crop&ixlib=rb-4.0.3&q=80`;
    await course.save();
    console.log(`Updated thumbnail for: ${course.title}`);
  }
  console.log('✅ All thumbnails updated!');
  process.exit(0);
}).catch(console.error);
"
pause

