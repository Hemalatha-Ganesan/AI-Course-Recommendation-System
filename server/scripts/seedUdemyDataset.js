const mongoose = require('mongoose');
const csv = require('csvtojson');
const Course = require('../models/Course');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

async function importUdemyDataset() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📥 Connected to MongoDB');

    // Get or create default instructor
    let instructor = await User.findOne({ role: 'admin' });
    if (!instructor) {
      console.log('📌 Creating default instructor...');
      instructor = await User.create({
        username: 'udemy_instructor',
        email: 'instructor@udemy.com',
        password: 'password123',
        role: 'admin'
      });
    }
    console.log(`✓ Using instructor: ${instructor.username}`);

    // Path to your CSV file - CHANGE THIS to your file location
    const csvFilePath = 'C:/Users/HEMALATHA/Downloads/udemy_courses_dataset.csv';
    // OR if file is in downloads:
    // const csvFilePath = 'C:/Users/YourUser/Downloads/udemy_courses.csv';

    console.log(`\n📖 Reading CSV from: ${csvFilePath}`);
    const csvData = await csv().fromFile(csvFilePath);
    console.log(`✓ Read ${csvData.length} rows from CSV`);

    // Transform CSV rows to Course documents
    const courses = csvData.map((row, idx) => {
      // Normalize level
      const rawLevel = (row.level || '').toLowerCase();
      let level = 'Beginner';
      if (rawLevel.includes('intermediate')) level = 'Intermediate';
      if (rawLevel.includes('advanced') || rawLevel.includes('expert')) level = 'Advanced';

      // Map category
      const subject = (row.published_subject || row.subject || 'Other').trim();
      const category = mapCategory(subject);

      // Clean title (remove "https://ww..." if present)
      const title = (row.course_title || row.title || '').trim()
        .split('http')[0]
        .trim();

      return {
        title: title || `Course ${idx}`,
        description: `${title}. Learn professional skills on the go.`,
        category: category,
        level: level,
        price: parseFloat(row.price) || 0,
        duration: parseFloat(row.content_duration) || 5, // default 5 hours
        rating: parseFloat(row.rating) || 0,
        numReviews: parseInt(row.num_reviews) || 0,
        thumbnail: row.url || '',
        instructor: instructor._id,
        isPublished: row.is_paid === 'TRUE' || row.is_paid === true,
        enrolledStudents: [],
        createdAt: new Date(row.published || Date.now()),
      };
    }).filter(c => c.title && c.title.length > 0); // filter empty titles

    console.log(`\n✓ Transformed ${courses.length} courses for import`);

    // Check if courses already exist
    const existingCount = await Course.countDocuments();
    if (existingCount > 0) {
      console.log(`\n⚠️  Database already has ${existingCount} courses`);
      const answer = await new Promise(resolve => {
        setTimeout(() => resolve('y'), 100); // auto yes for scripts
      });
      if (answer.toLowerCase() !== 'y') {
        console.log('Aborting import');
        process.exit(0);
      }
    }

    // Insert courses
    console.log('\n📥 Inserting courses...');
    const result = await Course.insertMany(courses);
    console.log(`\n✅ Successfully imported ${result.length} courses!`);

    // Show summary
    const summary = await Course.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    console.log('\n📊 Category Summary:');
    summary.forEach(s => {
      console.log(`  ${s._id}: ${s.count} courses | Avg Price: $${s.avgPrice.toFixed(2)} | Avg Rating: ${s.avgRating.toFixed(2)}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Import failed:', err.message);
    process.exit(1);
  }
}

// Map Udemy subjects to your category enums
function mapCategory(subject) {
  const text = (subject || '').toLowerCase();
  
  const mapping = {
    'business': 'Business',
    'finance': 'Business',
    'accounting': 'Business',
    'development': 'Development',
    'programming': 'Development',
    'web': 'Development',
    'software': 'Development',
    'mobile': 'Development',
    'design': 'Design',
    'ux': 'Design',
    'ui': 'Design',
    'marketing': 'Marketing',
    'seo': 'Marketing',
    'social': 'Marketing',
    'it': 'IT & Software',
    'data': 'IT & Software',
    'database': 'IT & Software',
    'personal': 'Personal Development',
    'health': 'Personal Development',
    'photography': 'Design',
    'music': 'Personal Development',
  };

  for (const [key, category] of Object.entries(mapping)) {
    if (text.includes(key)) return category;
  }

  return 'Other';
}

importUdemyDataset();
