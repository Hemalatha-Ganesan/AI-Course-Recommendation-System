# 🎓 AI Course Recommendation System (MERN + ML)

## 📌 Project Description

The AI Course Recommendation System is a web-based application that provides **personalized course suggestions** to users based on their interests, skill level, and interaction history.

This project integrates the **MERN stack** with a **Machine Learning recommendation engine** to deliver intelligent course recommendations instead of showing generic course lists to all users.




## 🛠️ Tech Stack Used

* **Frontend:** React.js
* **Backend:** Node.js with Express.js
* **Database:** MongoDB with Mongoose
* **ML Service:** Python (Flask / FastAPI)
* **API Communication:** REST APIs (JSON)

---
## 📁 Project Folder Structure

```
root/
│
├── client/        # React Frontend
├── server/        # Node/Express Backend
├── ml-service/    # Python Recommendation Engine
├── README.md
└── .gitignore
```

---

## ⚙️ Installation Steps

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-link>
cd <project-folder>
```

---

### 2️⃣ Run Backend Server

```bash
cd server
npm install
npm start
```

Server runs on: `http://localhost:5000`

---

### 3️⃣ Run React Frontend

```bash
cd client
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

---

### 4️⃣ Run ML Service

```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

---

## 🔐 Environment Variable Setup

### 📍 server/.env

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 📍 client/.env

```
REACT_APP_API_URL=http://localhost:5000
```

---

## 🚀 Features

* User Registration and Login
* Preference-based Course Recommendation
* Course Enrollment
* Feedback and Rating System
* AI-powered Recommendation Engine

---

## ✅ How It Works

1. User enters preferences in the React UI
2. Backend stores data in MongoDB
3. ML service processes user data
4. Recommended courses are sent back to the user interface

---

## 👩‍💻 Developed For

Academic Final Year Project — MERN + Machine Learning Integration
