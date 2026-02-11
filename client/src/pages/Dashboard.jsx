import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { courseAPI } from '../api/api';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Recommendations from '../components/Recommendations';

const Dashboard = () => {
  const { user, loading: userLoading } = useContext(UserContext);

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    totalCourses: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await courseAPI.getEnrolledCourses();

        const courses =
          res?.data?.courses ||
          res?.data?.data ||
          res?.data ||
          [];

        const validCourses = Array.isArray(courses) ? courses : [];

        setEnrolledCourses(validCourses);

        // ✅ Safe stats calculation
        const total = validCourses.length;
        const completed = validCourses.filter(
          (c) => c?.completed === true
        ).length;

        const inProgress = validCourses.filter(
          (c) => !c?.completed && (c?.progress ?? 0) > 0
        ).length;

        setStats({
          totalCourses: total,
          completed,
          inProgress,
        });
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
          'Failed to load enrolled courses'
        );
        setEnrolledCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  if (userLoading) return <Loader />;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Please log in to view your dashboard
          </h2>
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">
                 Welcome back, {user?.username} 👋
         </h1>

          <p className="text-indigo-100">
            Continue your learning journey
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Courses', value: stats.totalCourses },
            { label: 'In Progress', value: stats.inProgress },
            { label: 'Completed', value: stats.completed },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <p className="text-gray-600 text-sm font-medium">
                {item.label}
              </p>
              <p className="text-3xl font-bold mt-2 text-gray-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* My Courses */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Courses</h2>
            <Link
              to="/courses"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Browse All Courses →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : enrolledCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="mb-4">No enrolled courses yet</p>
              <Link
                to="/courses"
                className="bg-indigo-600 text-white px-6 py-2 rounded-md"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div
                  key={course._id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={
                      course?.thumbnail ||
                      'https://via.placeholder.com/400x200'
                    }
                    alt={course?.title}
                    className="w-full h-40 object-cover"
                  />

                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">
                      {course?.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4">
                      {course?.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{course?.progress ?? 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded">
                        <div
                          className="bg-indigo-600 h-2 rounded"
                          style={{
                            width: `${course?.progress ?? 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    <Link
                      to={`/course/${course._id}`}
                      className="block text-center bg-indigo-600 text-white py-2 rounded-md"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <Recommendations />
      </div>
    </div>
  );
};

export default Dashboard;
