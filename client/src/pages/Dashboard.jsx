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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Please log in to view your dashboard
          </h2>
          <Link
            to="/login"
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Calculate completion percentage
  const completionPercentage = stats.totalCourses > 0 
    ? Math.round((stats.completed / stats.totalCourses) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                Welcome back, {user?.username} 👋
              </h1>
              <p className="text-indigo-100 text-lg">
                Continue your learning journey and achieve your goals
              </p>
            </div>
            <div className="hidden lg:block text-6xl opacity-20">📚</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Total Courses */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold text-sm uppercase tracking-wider">
                Total Courses
              </h3>
              <span className="text-3xl">📚</span>
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats.totalCourses}</p>
            <p className="text-gray-500 text-sm mt-2">Enrolled courses</p>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold text-sm uppercase tracking-wider">
                In Progress
              </h3>
              <span className="text-3xl">🚀</span>
            </div>
            <p className="text-4xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-gray-500 text-sm mt-2">Courses being pursued</p>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold text-sm uppercase tracking-wider">
                Completed
              </h3>
              <span className="text-3xl">✅</span>
            </div>
            <p className="text-4xl font-bold text-emerald-600">{stats.completed}</p>
            <p className="text-gray-500 text-sm mt-2">Successfully finished</p>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold text-sm uppercase tracking-wider">
                Completion Rate
              </h3>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-4xl font-bold text-purple-600">{completionPercentage}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* My Courses Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <span>📖 My Courses</span>
                    </h2>
                  </div>
                  <Link
                    to="/courses"
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                  >
                    Browse More →
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {loading ? (
                  <div className="flex justify-center py-20">
                    <Loader />
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                    <p className="text-red-700 font-semibold mb-4">⚠️ {error}</p>
                    <Link
                      to="/courses"
                      className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                    >
                      Browse Courses
                    </Link>
                  </div>
                ) : enrolledCourses.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-6xl mb-4">🎓</p>
                    <p className="text-xl font-semibold text-gray-900 mb-4">No courses yet</p>
                    <p className="text-gray-600 mb-8">Start your learning journey by exploring our course catalog</p>
                    <Link
                      to="/courses"
                      className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                      Explore Courses
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrolledCourses.map((course) => (
                      <div
                        key={course._id}
                        className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                      >
                        {/* Course Image */}
                        <div className="relative overflow-hidden h-40 bg-gray-100">
                          <img
                            src={
                              course?.thumbnail ||
                              'https://via.placeholder.com/400x200?text=Course'
                            }
                            alt={course?.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-semibold text-indigo-600">
                            {course?.completed ? '✅ Complete' : 'In Progress'}
                          </div>
                        </div>

                        {/* Course Info */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {course?.title}
                          </h3>

                          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                            {course?.description || 'No description available'}
                          </p>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-semibold text-gray-700">Progress</span>
                              <span className="text-xs font-bold text-indigo-600">
                                {course?.progress ?? 0}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${course?.progress ?? 0}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Action Button */}
                          <Link
                            to={`/courses/${course._id}`}
                            className="w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                          >
                            Continue Learning
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            {/* Learning Streak */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Learning Streak</h3>
                <span className="text-2xl">🔥</span>
              </div>
              <p className="text-3xl font-bold text-orange-600 mb-2">0 days</p>
              <p className="text-xs text-gray-600">Keep it up!</p>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Achievements</h3>
                <span className="text-2xl">🏆</span>
              </div>
              <p className="text-3xl font-bold text-yellow-600 mb-2">3</p>
              <p className="text-xs text-gray-600">Badges earned</p>
            </div>

            {/* Study Time */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Study Time</h3>
                <span className="text-2xl">⏱️</span>
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">0 hrs</p>
              <p className="text-xs text-gray-600">This month</p>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span>💡 Recommended for You</span>
            </h2>
          </div>
          <div className="p-8">
            <Recommendations />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
