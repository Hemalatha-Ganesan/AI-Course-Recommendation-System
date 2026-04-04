const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');
const CourseContent = require('../models/CourseContent');

dotenv.config({ path: './.env' });

const sampleCourseContent = [
  // SECTION 1: Introduction (2 lessons - 1 video, 1 theory)
  {
    title: 'Course Introduction',
    lessons: [
      {
        title: 'Welcome & Overview',
        description: 'Course structure and learning objectives',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDuration: 3,
        content: '',
        materials: [],
        referenceLinks: [],
        isFree: true
      },
      {
        title: 'What You Will Learn (Theory)',
        description: 'Detailed course roadmap and expectations',
        videoUrl: '',
        videoDuration: 0,
        content: `## Course Learning Objectives\\n\\n**By the end of this course, you will be able to:**\\n\\n1. **Understand core concepts** - Master fundamental principles\\n2. **Practical application** - Apply knowledge through hands-on projects\\n3. **Best practices** - Follow industry standards and patterns\\n4. **Advanced techniques** - Learn optimization and scaling strategies\\n\\n### Prerequisites\\n- Basic programming knowledge\\n- Familiarity with web technologies\\n\\n### Course Structure\\n- **10 Sections** (25 lessons total)\\n- Mix of video lectures + theory modules\\n- Hands-on coding exercises\\n- Real-world projects`,
        materials: [
          { title: 'Course Syllabus PDF', url: 'https://example.com/syllabus.pdf' }
        ],
        referenceLinks: [],
        isFree: true
      }
    ]
  },
  // SECTION 2: Fundamentals (3 lessons)
  {
    title: 'Programming Fundamentals',
    lessons: [
      {
        title: 'Variables & Data Types (Video)',
        description: 'Essential building blocks of programming',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDuration: 8,
        content: '',
        materials: [],
        referenceLinks: [],
        isFree: false
      },
      {
        title: 'Control Structures (Theory)',
        description: 'Conditionals, loops, and decision making',
        videoUrl: '',
        videoDuration: 0,
        content: `## Control Structures Deep Dive\\n\\n### 1. Conditional Statements\\n**if/else statements** allow code execution based on conditions:\\n\\n\`\`\`javascript\\nif (condition) {\\n  // execute if true\\n} else {\\n  // execute if false\\n}\\n\`\`\`\\n\\n### 2. Loop Types\\n- **for loops**: Known iterations\\n- **while loops**: Condition-based\\n- **forEach**: Array iteration\\n\\n### 3. Switch Statements\\nPerfect for multiple conditions:\\n\`\`\`javascript\\nswitch (value) {\\n  case 'A':\\n    // handle A\\n    break;\\n}\\n\`\`\``,
        materials: [],
        referenceLinks: [
          { title: 'MDN Loops Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration' }
        ],
        isFree: false
      },
      {
        title: 'Functions Basics (Video)',
        description: 'Reusable code blocks',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDuration: 10,
        content: '',
        materials: [],
        referenceLinks: [],
        isFree: false
      }
    ]
  },
  // SECTION 3: Data Structures (2 lessons)
  {
    title: 'Data Structures & Algorithms',
    lessons: [
      {
        title: 'Arrays & Objects (Theory)',
        description: 'Primary data containers',
        videoUrl: '',
        videoDuration: 0,
        content: `## Core Data Structures\\n\\n### Arrays\\nOrdered collections:\\n\`\`\`javascript\\nconst fruits = ['apple', 'banana', 'orange'];\\nfruits.push('grapes'); // Add\\nfruits.pop(); // Remove\\nmap, filter, reduce // Transform\\n\`\`\`\\n\\n### Objects (Dictionaries)\\nKey-value pairs:\\n\`\`\`javascript\\nconst user = {\\n  name: 'John',\\n  age: 30,\\n  skills: ['JS', 'React']\\n};\\n\`\`\`\\n\\n**Time Complexities:**\\n- Array access: O(1)\\n- Object lookup: Average O(1)`,
        materials: [],
        referenceLinks: [],
        isFree: false
      },
      {
        title: 'Basic Algorithms (Video)',
        description: 'Search, sort, common patterns',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDuration: 12,
        content: '',
        materials: [],
        referenceLinks: [],
        isFree: false
      }
    ]
  },
  // SECTION 4: Asynchronous Programming (3 lessons)
  {
    title: 'Async Programming',
    lessons: [
      {
        title: 'Promises & Async/Await (Video)',
        description: 'Handling non-blocking operations',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDuration: 15,
        content: '',
        materials: [],
        referenceLinks: [],
        isFree: false
      },
      {
        title: 'Error Handling Async (Theory)',
        description: 'try/catch, .catch(), rejection patterns',
        videoUrl: '',
        videoDuration: 0,
        content: `## Async Error Patterns\\n\\n### 1. Promise Rejection\\n\`\`\`javascript\\nnew Promise((resolve, reject) => {\\n  if (error) reject('Error message');\\n}).catch(err => console.log(err));\\n\`\`\`\\n\\n### 2. Async/Await + Try/Catch\\n\`\`\`javascript\\nasync function fetchData() {\\n  try {\\n    const data = await apiCall();\\n  } catch (error) {\\n    console.error('API failed:', error);\\n  }\\n}\\n\`\`\`\\n\\n### 3. Global Error Handler\\nwindow.addEventListener('unhandledrejection', e => {\\n  console.error('Unhandled:', e.reason);\\n});`,
        materials: [],
        referenceLinks: [],
        isFree: false
      },
      {
        title: 'Real-world Async Patterns',
        description: 'API calls, debouncing, retries',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDuration: 18,
        content: '',
        materials: [],
        referenceLinks: [],
        isFree: false
      }
    ]
  },
  // Continue pattern for sections 5-10...
  {
    title: 'DOM Manipulation',
    lessons: [
      {
        title: 'Selecting Elements (Theory)',
        description: 'querySelector, getElementById patterns',
        videoUrl: '',
        videoDuration: 0,
        content: '## DOM Selection Methods... [abbreviated for space]',
        materials: [],
        referenceLinks: [],
        isFree: false
      },
      {
        title: 'Event Handling (Video)',
        description: 'Listeners, delegation, event bubbling',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoDuration: 14,
        content: '',
        materials: [],
        referenceLinks: [],
        isFree: false
      }
    ]
  },
  // [8 more sections following same pattern: mix 2-3 lessons video+theory]
  {
    title: 'Section 6: State Management',
    lessons: [
      { title: 'useState Deep Dive (Theory)', videoUrl: '', content: 'Theory...', videoDuration: 0 },
      { title: 'useReducer Patterns (Video)', videoUrl: 'video', content: '', videoDuration: 16 }
    ]
  },
  {
    title: 'Section 7: Performance',
    lessons: [
      { title: 'Memoization Theory', videoUrl: '', content: 'Theory...', videoDuration: 0 },
      { title: 'React.memo (Video)', videoUrl: 'video', content: '', videoDuration: 12 },
      { title: 'useCallback/useMemo', videoUrl: '', content: 'Theory...', videoDuration: 0 }
    ]
  },
  {
    title: 'Section 8: Testing',
    lessons: [
      { title: 'Unit Testing Theory', videoUrl: '', content: 'Theory...', videoDuration: 0 },
      { title: 'React Testing Library (Video)', videoUrl: 'video', content: '', videoDuration: 20 }
    ]
  },
  {
    title: 'Section 9: Deployment',
    lessons: [
      { title: 'Build & Optimization (Video)', videoUrl: 'video', content: '', videoDuration: 15 },
      { title: 'CI/CD Theory', videoUrl: '', content: 'Theory...', videoDuration: 0 }
    ]
  },
  {
    title: 'Section 10: Next Steps',
    lessons: [
      { title: 'Advanced Topics Overview (Theory)', videoUrl: '', content: 'Future learning path...', videoDuration: 0 },
      { title: 'Final Project (Video)', videoUrl: 'video', content: '', videoDuration: 25 },
      { title: 'Course Wrap-up', videoUrl: '', content: 'Summary + certificate...', videoDuration: 0 }
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
        console.log(`Content exists for ${course.title}, skipping`);
        continue; // Skip reseed to preserve data
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

