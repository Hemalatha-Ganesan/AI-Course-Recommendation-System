const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CourseContent = require('../models/CourseContent');
const Course = require('../models/Course');

dotenv.config({ path: './../../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_course_recommendation';

// Auto-map categories to YouTube playlists/videos
const categoryVideos = {
  'Development': {
    playlists: ['PL4cUxeGkcC9gcy9lrvMJ75z9maRw4byYp'], // freeCodeCamp React
    videos: [
      'https://www.youtube.com/embed/bMknfKXIFA8', // React full
      'https://www.youtube.com/embed/fBNz5xF-Kx4', // Node
      'https://www.youtube.com/embed/hdI2bqOjy3c', // JS Crash
      'https://www.youtube.com/embed/8DvywoWv6fI'  // Python
    ]
  },
  'Business': {
    videos: [
      'https://www.youtube.com/embed/U20Vh7OKH4o', // Business basics
      'https://www.youtube.com/embed/9No-FiEInLA', // Accounting
      'https://www.youtube.com/embed/_Bs1a5WGK34'  // Marketing
    ]
  },
  'Design': {
    videos: [
      'https://www.youtube.com/embed/OtqYdr-XpGY', // Figma
      'https://www.youtube.com/embed/XPtbyeiL8Js', // Photoshop
      'https://www.youtube.com/embed/90FU8NtSdrY'  // UI/UX
    ]
  },
  'Marketing': {
    videos: [
      'https://www.youtube.com/embed/q5cWJwM-vZ0', // Digital Marketing
      'https://www.youtube.com/embed/wCzb0bTWQ8A', // SEO
      'https://www.youtube.com/embed/BpyoXQlHV6E'  // Google Ads
    ]
  },
  'IT & Software': {
    videos: [
      'https://www.youtube.com/embed/k7RDofEEiUI', // AWS
      'https://www.youtube.com/embed/3h3s13N8dLc', // Cybersecurity
      'https://www.youtube.com/embed/HXV3zeQKqGY'  // Docker
    ]
  },
  'Personal Development': {
    videos: [
      'https://www.youtube.com/embed/M7JW6w6Y40A', // Time Management
      'https://www.youtube.com/embed/In9WHqCAuA4'  // Productivity
    ]
  }
};

async function seedCategoryVideos() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🎥 Seeding ALL CATEGORIES with YouTube Videos');

    const courses = await Course.find({ isPublished: true });
    console.log(`Found ${courses.length} courses to add videos`);

    let seeded = 0;

    for (const course of courses) {
      const existing = await CourseContent.findOne({ course: course._id });
      if (existing) {
        await CourseContent.findByIdAndDelete(existing._id);
      }

      const categoryVideosData = categoryVideos[course.category] || categoryVideos['Development'];

      // Create 3 sections with category videos
      const sections = [
        {
          title: `${course.title} - Introduction`,
          lessons: categoryVideosData.videos.slice(0,2).map((videoUrl, i) => ({
            title: `${course.title} Lesson ${i+1}`,
            videoUrl,
            videoDuration: 15 + i * 5,
            content: `## ${course.title} Notes\\nReal YouTube content from ${course.category} category.\\nDuration: ${15 + i * 5}min`
          }))
        },
        {
          title: `${course.title} - Advanced`,
          lessons: categoryVideosData.videos.slice(2,4).map((videoUrl, i) => ({
            title: `${course.title} Advanced ${i+1}`,
            videoUrl: videoUrl || categoryVideosData.videos[0],
            videoDuration: 20 + i * 3,
            content: 'Advanced concepts and practical examples'
          }))
        },
        {
          title: `${course.title} - Projects`,
          lessons: [{
            title: 'Capstone Project',
            videoUrl: categoryVideosData.videos[0] || 'https://www.youtube.com/embed/bMknfKXIFA8',
            videoDuration: 30,
            content: 'Build real project with all learned concepts'
          }]
        }
      ];

      await CourseContent.create({
        course: course._id,
        sections
      });

      console.log(`✅ ${course.category}: "${course.title}" (3 sections with YouTube videos)`);
      seeded++;
    }

    console.log(`\\n🎉 Seeded YouTube videos for ${seeded} courses across ALL categories!`);
    console.log('Test: Login → Courses → Enroll → Learn');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  }
}

seedCategoryVideos();

