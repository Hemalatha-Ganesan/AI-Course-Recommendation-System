import React, { useState, useEffect } from 'react';
import { courseAPI, recommendationAPI } from '../api/api';
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
  const [searchFallback, setSearchFallback] = useState(false); // true when no direct match and trending shown

  useEffect(() => {
  const fetchCourses = async (params = {}) => {
      try {
        const response = await courseAPI.getAllCourses(params);
        const courseList = response.data.data || response.data.courses || [];
        setCourses(courseList);
        setFilteredCourses(courseList);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses({ params: { limit: 100, page: 1 } });
  }, []);

  useEffect(() => {
    const applyFilters = async () => {
      let filtered = [...courses];

      // If user is searching, use the recommendation API for better results
      if (filters.search && filters.search.trim().length > 0) {
        try {
          setLoading(true);
          // ignore category/difficulty when calling search API
          const response = await recommendationAPI.searchRecommendations(
            filters.search,
            100 // limit
          );
          filtered = response.data.data || [];
        } catch (error) {
          console.error('Error fetching search recommendations:', error);
          // fallback to client-side filter
          filtered = courses.filter(course =>
            course.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
            course.description?.toLowerCase().includes(filters.search.toLowerCase())
          );
        } finally {
          setLoading(false);
        }
        // if no matches, show trending courses as suggestions
        if (filtered.length === 0) {
          setSearchFallback(true);
          try {
            const trendRes = await recommendationAPI.getTrendingCourses(6);
            filtered = trendRes.data.data || [];
          } catch (e) {
            console.warn('Trending fetch failed:', e);
          }
        } else {
          setSearchFallback(false);
        }
      } else {
        setSearchFallback(false);
        // No search query, apply regular filters
        if (filters.category) {
          filtered = filtered.filter(course => 
            course.category?.toLowerCase() === filters.category.toLowerCase()
          );
        }

        if (filters.difficulty) {
          filtered = filtered.filter(course => 
            course.level?.toLowerCase() === filters.difficulty.toLowerCase() ||
            course.difficulty?.toLowerCase() === filters.difficulty.toLowerCase()
          );
        }
      }

      setFilteredCourses(filtered);
    };

    applyFilters();
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
            <option value="Development">Development</option>
            <option value="Business">Business</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="IT & Software">IT & Software</option>
            <option value="Personal Development">Personal Development</option>
            <option value="Other">Other</option>
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
        <div>
          {filters.search && (
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f4ff', borderRadius: '8px', borderLeft: '4px solid #7c3aed' }}>
              <p style={{ margin: '0', color: '#7c3aed', fontSize: '14px', fontWeight: '600' }}>
                📚 Showing {filteredCourses.length} course(s) recommended for "<strong>{filters.search}</strong>"
                {searchFallback && ' (fallback to trending courses)'}
              </p>
            </div>
          )}
          <div className="courses-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map((course, index) => (
              <div key={course._id} className={`animate-in slide-in-from-bottom-${Math.min(index % 6 + 1, 6)} duration-700 fade-in stagger-100`}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      ) : loading ? (
        <Loader />
      ) : (
        <div className="no-courses">
          <h3>No courses found</h3>
          {filters.search && (
            <p>Try searching for different keywords like "Python", "ML", "Web Development", etc.</p>
          )}
          {!filters.search && (
            <p>Try adjusting your filters</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;

