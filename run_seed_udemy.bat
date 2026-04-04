@echo off
cd /d server
echo Running Udemy course seeding...
node scripts\seedUdemyDataset.js
echo.
echo Seed complete! Check TODO_FETCH_COURSES.md for next steps.
pause
