# Backend Deployment

## Render.com (Recommended - Free)

1. Sign up at render.com with GitHub
2. New → Web Service → Connect repo
3. Root Directory: `server`
4. Build: `npm install`
5. Start: `npm start`
6. Env vars from .env.example (MongoDB Atlas URI, JWT_SECRET)

Live URL: https://your-app.onrender.com/api/health

## Railway.app

Similar, $5 credit free.

## Seed Data
```bash
cd server
node scripts/seedCourses.js
```

Test: curl /api/health

