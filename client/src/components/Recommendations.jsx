import React, { useEffect, useState, useContext } from 'react';
import { courseAPI } from '../api/api';
import { UserContext } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

const Recommendations = () => {
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseAPI.getAllCourses();
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCourses();
  }, [user]);

  if (loading) return <p>Loading recommendations...</p>;

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Recommended Courses</h2>

      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        courses.slice(0, 4).map((course) => (
          <div
            key={course._id}
            style={{
              border: '1px solid #ddd',
              padding: '12px',
              margin: '10px 0',
              borderRadius: '6px',
            }}
          >
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <Link to={`/courses/${course._id}`}>View Course</Link>
          </div>
        ))
      )}
    </div>
  );
};

export default Recommendations;
