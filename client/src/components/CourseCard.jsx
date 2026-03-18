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
    <div className="course-card group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 ease-out bg-gradient-to-br from-slate-50 to-blue-50 hover:from-blue-50 hover:to-indigo-100 border border-slate-200 hover:border-indigo-300 cursor-pointer">
      <div className="course-image relative overflow-hidden rounded-t-2xl">
        <img 
          src={imageUrl || course.thumbnail || 'https://images.unsplash.com/photo-1524178232363-9330f4042379?w=500&fit=crop'}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        <span 
          className="difficulty-badge absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold shadow-lg"
          style={{ backgroundColor: getDifficultyColor(difficulty) }}
        >
          {difficulty || course.level || 'N/A'}
        </span>
      </div>

      <div className="course-content">
        <span className="course-category inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 mb-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">{course.category || category || 'General'}</span>
        <h3 className="course-title font-bold text-xl mb-3 line-clamp-2 group-hover:text-indigo-700 transition-colors duration-300">{title}</h3>
        <p className="course-description text-gray-600 text-sm line-clamp-2 mb-4 group-hover:text-gray-800 transition-colors duration-300">
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

        <Link to={`/courses/${_id}`} className="view-course-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group-hover:scale-105">
          View Details
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;