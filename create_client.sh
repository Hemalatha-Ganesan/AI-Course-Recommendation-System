#!/bin/bash

BASE="client"

# Create folder structure
mkdir -p $BASE/public $BASE/src/api $BASE/src/assets $BASE/src/components $BASE/src/pages $BASE/src/contexts $BASE/src/hooks $BASE/src/utils

# Create files
touch $BASE/public/index.html
touch $BASE/public/favicon.ico
touch $BASE/src/api/recommendationAPI.js
touch $BASE/src/components/CourseCard.jsx
touch $BASE/src/components/Recommendations.jsx
touch $BASE/src/components/Navbar.jsx
touch $BASE/src/components/Footer.jsx
touch $BASE/src/components/Loader.jsx
touch $BASE/src/pages/Dashboard.jsx
touch $BASE/src/pages/Courses.jsx
touch $BASE/src/pages/CourseDetails.jsx
touch $BASE/src/pages/Login.jsx
touch $BASE/src/pages/Signup.jsx
touch $BASE/src/contexts/UserContext.jsx
touch $BASE/src/hooks/useUserActivity.js
touch $BASE/src/utils/formatDate.js
touch $BASE/src/App.jsx
touch $BASE/src/index.js
touch $BASE/src/index.css
touch $BASE/package.json
touch $BASE/README.md

echo "React client folder structure created successfully!"
