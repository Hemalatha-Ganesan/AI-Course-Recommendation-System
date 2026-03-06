const fs = require('fs');
const content = `PORT=5000
MONGO_URI=mongodb://localhost:27017/ai_course_recommendation
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development`;
fs.writeFileSync('d:/AI-Driven-CourseRecommendation System/server/.env', content);
console.log('Done');
