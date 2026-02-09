import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaUsers } from 'react-icons/fa';
// Remove this line: import './CourseCard.css';

const CourseCard = ({ course }) => {
  const {
    _id,
    title,
    description,
    category,
    difficulty,
    duration,
    instructor,
    rating,
    enrolledCount,
    imageUrl
  } = course;

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
    <div className="course-card">
      <div className="course-image">
        <img 
          src={imageUrl || 'https://via.placeholder.com/400x200?text=Course+Image'} 
          alt={title} 
        />
        <span 
          className="difficulty-badge" 
          style={{ backgroundColor: getDifficultyColor(difficulty) }}
        >
          {difficulty || 'N/A'}
        </span>
      </div>

      <div className="course-content">
        <span className="course-category">{category || 'General'}</span>
        <h3 className="course-title">{title}</h3>
        <p className="course-description">
          {description?.length > 100 
            ? `${description.substring(0, 100)}...` 
            : description || 'No description available'}
        </p>

        <div className="course-instructor">
          <strong>Instructor:</strong> {instructor || 'TBA'}
        </div>

        <div className="course-meta">
          <div className="meta-item">
            <FaStar className="icon" />
            <span>{rating ? rating.toFixed(1) : 'N/A'}</span>
          </div>
          <div className="meta-item">
            <FaClock className="icon" />
            <span>{duration || 0}h</span>
          </div>
          <div className="meta-item">
            <FaUsers className="icon" />
            <span>{enrolledCount || 0}</span>
          </div>
        </div>

        <Link to={`/courses/${_id}`} className="view-course-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;