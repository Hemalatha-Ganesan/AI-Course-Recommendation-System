@echo off
echo Starting video content seeding...
cd /d server
node scripts\seed100Courses.js
if %errorlevel% neq 0 exit /b %errorlevel%
node scripts\seedRealYouTubeContent.js
echo.
echo ✅ Video content seeded! Check TODO_VIDEO_SEED.md
pause
