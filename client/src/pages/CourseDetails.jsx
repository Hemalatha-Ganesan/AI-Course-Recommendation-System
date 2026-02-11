import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI } from '../api/api';
import { UserContext } from '../contexts/UserContext';
import useUserActivity from '../hooks/useUserActivity';
import Loader from '../components/Loader';
import { FaStar, FaClock, FaUsers, FaBook } from 'react-icons/fa';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {isAuthenticated } = useContext(UserContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  // Track user activity
  useUserActivity(id, 'view');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseAPI.getCourseById(id);
        setCourse(response.data.course);
        // Check if user is enrolled
        setEnrolled(response.data.enrolled || false);
      } catch (error) {
        console.error('Failed to fetch course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      await courseAPI.enrollCourse(id);
      setEnrolled(true);
      alert('Successfully enrolled!');
    } catch (error) {
      console.error('Failed to enroll:', error);
      alert('Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!course) {
    return (
      <div className="no-courses">
        <h3>Course not found</h3>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return '#10b981';
      case 'intermediate':
        return '#f59e0b';
      case 'advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="course-details-container">
      <div className="course-details-header">
        <img
          src={course.imageUrl || 'https://via.placeholder.com/1000x400?text=Course+Image'}
          alt={course.title}
          className="course-details-image"
        />
        
        <h1 className="course-details-title">{course.title}</h1>
        
        <div className="course-details-meta">
          <div className="meta-item">
            <FaStar className="icon" />
            <span>{course.rating ? course.rating.toFixed(1) : 'N/A'} Rating</span>
          </div>
          <div className="meta-item">
            <FaClock className="icon" />
            <span>{course.duration || 0} hours</span>
          </div>
          <div className="meta-item">
            <FaUsers className="icon" />
            <span>{course.enrolledCount || 0} students</span>
          </div>
          <div className="meta-item">
            <FaBook className="icon" />
            <span 
              style={{ 
                color: getDifficultyColor(course.difficulty),
                fontWeight: 600 
              }}
            >
              {course.difficulty || 'N/A'}
            </span>
          </div>
        </div>

        {enrolled ? (
          <div className="enrolled-badge">
            ✓ Already Enrolled
          </div>
        ) : (
          <button
            className="enroll-btn"
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
        )}
      </div>

      <div className="course-details-description">
        <h2>About this course</h2>
        <p>{course.description}</p>
        
        <h2 style={{ marginTop: '2rem' }}>What you'll learn</h2>
        <ul style={{ lineHeight: '2', marginLeft: '2rem', color: '#4b5563' }}>
          <li>Master the fundamentals of {course.category}</li>
          <li>Build real-world projects</li>
          <li>Get hands-on experience</li>
          <li>Earn a certificate upon completion</li>
        </ul>

        <h2 style={{ marginTop: '2rem' }}>Instructor</h2>
        <p><strong>{course.instructor || 'Expert Instructor'}</strong></p>
      </div>
    </div>
  );
};

export default CourseDetails;