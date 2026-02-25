import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';

// User Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>

          {/* ── AUTH ROUTES: NO Navbar/Footer — needs full screen ── */}
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ── USER ROUTES: With Navbar + main + Footer ── */}
          <Route path="/dashboard" element={
            <div className="App">
              <Navbar />
              <main><Dashboard /></main>
              <Footer />
            </div>
          } />

          <Route path="/profile" element={
            <div className="App">
              <Navbar />
              <main><UserProfile /></main>
              <Footer />
            </div>
          } />

          <Route path="/courses" element={
            <div className="App">
              <Navbar />
              <main><Courses /></main>
              <Footer />
            </div>
          } />

          <Route path="/courses/:id" element={
            <div className="App">
              <Navbar />
              <main><CourseDetails /></main>
              <Footer />
            </div>
          } />

          {/* ── ADMIN ROUTES: Completely separate ── */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          } />

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" />} />

        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;