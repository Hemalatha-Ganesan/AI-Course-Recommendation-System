import React, { useEffect, useState, useContext } from 'react';
import { recommendationAPI } from '../api/api';
import { UserContext } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

const Recommendations = () => {
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use personalized recommendations if user is logged in
        if (user) {
          console.log('📊 Fetching personalized recommendations for user:', user._id);
          const res = await recommendationAPI.getPersonalizedRecommendations();
          console.log('✅ Recommendations response:', res.data);
          const coursesData = res.data?.data || [];
          setCourses(Array.isArray(coursesData) ? coursesData : []);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error('❌ Error fetching recommendations:', err);
        setError('Failed to load recommendations');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  if (loading) return <p>Loading recommendations...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>My Learning Path</h2>

      {courses.length === 0 ? (
        <p>No recommendations found. Start exploring courses to get personalized recommendations!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.slice(0, 4).map((item) => {
            // Handle both direct course objects and objects with nested course data
            const course = item.course || item;
            return (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Course Image */}
                <div className="h-32 overflow-hidden bg-gray-200">
                  <img 
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop'} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1 truncate">{course.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {course.description || 'No description'}
                  </p>
                  <Link to={`/courses/${course._id}`} className="inline-block mt-2 text-purple-600 hover:underline text-sm">
                    View Course
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Recommendations;

