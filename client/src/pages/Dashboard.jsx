import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { courseAPI } from '../api/api';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Recommendations from '../components/Recommendations';
import { FaArrowRight } from 'react-icons/fa';

const Dashboard = () => {
  const { user, loading: userLoading } = useContext(UserContext);

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    totalCourses: 0,
    inProgress: 0,
    completed: 0,
    learningStreak: 0,
    studyHours: 0,
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
          learningStreak: Math.floor(Math.random() * 30),
          studyHours: Math.floor(Math.random() * 100),
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -ml-36 -mb-36"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Welcome back, {user?.username || user?.name} 👋
              </h1>
              <p className="text-indigo-100 text-lg">
                {user?.email && <span>Email: {user.email} • </span>}
                Continue your learning journey and achieve your goals
              </p>
            </div>
            <div className="hidden lg:flex text-8xl opacity-20">📚</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Premium Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Courses Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-slate-600 text-sm font-semibold uppercase tracking-wider">Total Courses</p>
                <p className="text-4xl font-bold text-slate-900 mt-2">{stats.totalCourses}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg text-2xl group-hover:scale-110 transition">📚</div>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded-full"></div>
            <p className="text-slate-500 text-xs mt-3">Enrolled courses</p>
          </div>

          {/* In Progress Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-slate-600 text-sm font-semibold uppercase tracking-wider">In Progress</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">{stats.inProgress}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg text-2xl group-hover:scale-110 transition">🚀</div>
            </div>
            <div className="w-full bg-blue-200 h-1 rounded-full" style={{width: `${(stats.inProgress/Math.max(stats.totalCourses, 1))*100}%`}}></div>
            <p className="text-slate-500 text-xs mt-3">Courses being pursued</p>
          </div>

          {/* Completed Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-slate-600 text-sm font-semibold uppercase tracking-wider">Completed</p>
                <p className="text-4xl font-bold text-emerald-600 mt-2">{stats.completed}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg text-2xl group-hover:scale-110 transition">✅</div>
            </div>
            <div className="w-full bg-emerald-200 h-1 rounded-full" style={{width: `${(stats.completed/Math.max(stats.totalCourses, 1))*100}%`}}></div>
            <p className="text-slate-500 text-xs mt-3">Successfully finished</p>
          </div>

          {/* Completion Rate Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-slate-600 text-sm font-semibold uppercase tracking-wider">Completion Rate</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">{completionPercentage}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg text-2xl group-hover:scale-110 transition">📊</div>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-slate-500 text-xs mt-3">Overall progress</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Courses Section - Main */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <span className="text-3xl">📖</span> My Learning Path
                  </h2>
                  <Link
                    to="/courses"
                    className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-200 whitespace-nowrap hover:translate-x-1"
                  >
                    Browse More <FaArrowRight className="text-sm" />
                  </Link>
                </div>
              </div>

              {/* Courses List */}
              <div className="p-8">
                {loading ? (
                  <div className="flex justify-center py-20">
                    <Loader />
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                    <p className="text-red-700 font-semibold mb-4 text-lg">⚠️ {error}</p>
                    <Link
                      to="/courses"
                      className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                    >
                      Browse Courses
                    </Link>
                  </div>
                ) : enrolledCourses.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-7xl mb-6">🎓</p>
                    <p className="text-2xl font-bold text-slate-900 mb-3">No courses yet</p>
                    <p className="text-slate-600 mb-8 text-lg">Start your learning journey by exploring our course catalog</p>
                    <Link
                      to="/courses"
                      className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      Explore Courses
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrolledCourses.map((course) => (
                      <div
                        key={course._id}
                        className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 flex flex-col hover:bg-white"
                      >
                        {/* Course Image */}
                        <div className="relative overflow-hidden h-40 bg-gradient-to-br from-indigo-200 to-purple-200">
                          <img
                            src={
                              course?.thumbnail ||
                              'https://via.placeholder.com/400x200?text=Course'
                            }
                            alt={course?.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 shadow-md">
                            {course?.completed ? '✅ Complete' : 'In Progress'}
                          </div>
                        </div>

                        {/* Course Info */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition">
                            {course?.title}
                          </h3>

                          <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-1">
                            {course?.description || 'No description available'}
                          </p>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-semibold text-slate-700">Progress</span>
                              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                {course?.progress ?? 0}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
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
                            className="w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:shadow-lg"
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
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Learning Streak</h3>
                <span className="text-3xl">🔥</span>
              </div>
              <p className="text-4xl font-bold text-orange-600 mb-2">{stats.learningStreak}</p>
              <div className="text-xs text-slate-600 space-y-1">
                <p>Days in a row</p>
                <div className="w-full bg-orange-200 h-1.5 rounded-full mt-2">
                  <div className="bg-orange-600 h-1.5 rounded-full" style={{width: `${Math.min(stats.learningStreak*3.3, 100)}%`}}></div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-lg p-6 border border-yellow-100 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Achievements</h3>
                <span className="text-3xl">🏆</span>
              </div>
              <p className="text-4xl font-bold text-yellow-600 mb-2">3</p>
              <p className="text-xs text-slate-600">Badges earned</p>
              <div className="flex gap-2 mt-4">
                <span className="text-2xl">⭐</span>
                <span className="text-2xl">🥇</span>
                <span className="text-2xl">🎖️</span>
              </div>
            </div>

            {/* Study Time */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Study This Month</h3>
                <span className="text-3xl">⏱️</span>
              </div>
              <p className="text-4xl font-bold text-green-600 mb-2">{stats.studyHours}</p>
              <p className="text-xs text-slate-600">hours spent</p>
              <div className="text-xs text-slate-500 mt-2">
                <p>Daily goal: 1 hour</p>
              </div>
            </div>

            {/* View Profile Button */}
            <Link
              to="/profile"
              className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700"
            >
              View My Profile
            </Link>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <span className="text-3xl">💡</span> Recommended for You
            </h2>
            <p className="text-slate-600 text-sm mt-1">Personalized courses based on your interests</p>
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
