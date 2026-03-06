import React, { useEffect, useState } from 'react';
import { recommendationAPI } from '../api/api';
import { Link } from 'react-router-dom';

const PopularCourses = ({ limit = 6 }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        const res = await recommendationAPI.getTrendingCourses(limit);
        console.log('📊 Trending Courses Response:', res);
        const coursesData = res.data?.data || res?.data || [];
        console.log('📚 Courses Data:', coursesData);
        if (!Array.isArray(coursesData)) {
          console.warn('⚠️  coursesData is not an array:', coursesData);
        }
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (err) {
        console.error('❌ Error fetching popular courses:', err);
        console.error('Error details:', err.response?.data || err.message);
        setError('Failed to load popular courses');
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, [limit]);

  if (loading) return <p>Loading popular courses...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <div key={course._id || course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          {/* Course Image */}
          <div className="h-40 overflow-hidden bg-gray-200">
            <img 
              src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop'} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2 truncate">{course.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-2">
              {course.description || 'No description provided'}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm font-semibold text-green-600">₹{course.price}</span>
              <span className="text-xs text-slate-500">{course.enrolledStudents?.length || 0} students</span>
            </div>
            <Link to={`/courses/${course._id}`} className="inline-block mt-2 text-purple-600 hover:underline">
              View course →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PopularCourses;

