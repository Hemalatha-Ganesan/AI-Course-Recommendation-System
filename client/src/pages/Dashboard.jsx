import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { courseAPI } from '../api/api';
import { FaBook, FaClock, FaStar } from 'react-icons/fa';
import Recommendations from '../components/Recommendations';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading: userLoading } = useContext(UserContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await courseAPI.getEnrolledCourses();
        setEnrolledCourses(response.data.courses || []);
      } catch (error) {
        console.error('Failed to fetch enrolled courses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  if (userLoading || loading) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name || 'Student'}! 👋</h1>
        <p>Continue your learning journey</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <FaBook className="icon" />
          <h3>{enrolledCourses.length}</h3>
          <p>Enrolled Courses</p>
        </div>
        <div className="stat-card">
          <FaClock className="icon" />
          <h3>0</h3>
          <p>Hours Learned</p>
        </div>
        <div className="stat-card">
          <FaStar className="icon" />
          <h3>0</h3>
          <p>Certificates Earned</p>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>My Courses</h2>
          <Link to="/courses" className="view-all-link">View All →</Link>
        </div>
        {enrolledCourses.length > 0 ? (
          <div className="courses-grid">
            {enrolledCourses.slice(0, 3).map((course) => (
              <div key={course._id} className="course-card">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-courses">
            <p>You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
              Browse Courses
            </Link>
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <Recommendations />
      </div>
    </div>
  );
};

export default Dashboard;