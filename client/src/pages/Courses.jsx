import React, { useState, useEffect } from 'react';
import { courseAPI } from '../api/api';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: ''
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getAllCourses();
        setCourses(response.data.courses || []);
        setFilteredCourses(response.data.courses || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = [...courses];

    if (filters.category) {
      filtered = filtered.filter(course => 
        course.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.difficulty) {
      filtered = filtered.filter(course => 
        course.difficulty?.toLowerCase() === filters.difficulty.toLowerCase()
      );
    }

    if (filters.search) {
      filtered = filtered.filter(course =>
        course.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  }, [filters, courses]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>Explore Courses</h1>
        <p>Discover courses that match your interests</p>
      </div>

      <div className="courses-filters">
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            name="search"
            placeholder="Search courses..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Category</label>
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            <option value="programming">Programming</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
            <option value="marketing">Marketing</option>
            <option value="data science">Data Science</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Difficulty</label>
          <select name="difficulty" value={filters.difficulty} onChange={handleFilterChange}>
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="no-courses">
          <h3>No courses found</h3>
          <p>Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default Courses;