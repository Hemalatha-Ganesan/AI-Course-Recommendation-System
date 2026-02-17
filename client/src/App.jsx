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
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* PUBLIC ROUTES - User Interface with Navbar & Footer */}
          <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
          <Route path="/signup" element={<><Navbar /><Signup /><Footer /></>} />
          <Route path="/dashboard" element={<><Navbar /><Dashboard /><Footer /></>} />
          <Route path="/courses" element={<><Navbar /><Courses /><Footer /></>} />
          <Route path="/courses/:id" element={<><Navbar /><CourseDetails /><Footer /></>} />

          {/* ADMIN ROUTES - Completely Separate Interface (No Navbar/Footer) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;