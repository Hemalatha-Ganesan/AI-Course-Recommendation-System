@echo off
echo Fixing dashboard...
cd /d server
node scripts\getCourseStats.js
echo.
echo Run in new terminals:
echo 1. cd server ^&^& npm start
echo 2. cd client ^&^& npm start
echo.
echo Available courses: 75 (API working)
echo Check browser F12 ^> Console for API calls
pause

