import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { adminAPI } from '../../api/api';

const StatCard = ({ title, value, subtitle, icon, change, color, onClick, className = '' }) => (
  <div
    className={`group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:bg-white ${className} ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
        <span className="text-xl font-bold text-white">{icon}</span>
      </div>
      {change !== undefined && (
        <span
          className={`text-sm font-bold px-2 py-1 rounded-full ${
            change >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {change >= 0 ? '+' : '-'} {Math.abs(change)}%
        </span>
      )}
    </div>
    <p className="text-3xl lg:text-4xl font-black text-slate-900 mb-1 leading-tight">{value}</p>
    <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{title}</p>
    {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
  </div>
);

const MiniBarChart = ({ data, labels, colors }) => (
  <div className="h-24 flex items-end justify-around gap-1 bg-slate-50/50 backdrop-blur-sm rounded-xl p-2">
    {data.map((value, i) => {
      const maxValue = Math.max(...data, 1);
      const height = Math.max((value / maxValue) * 80, 10);
      return (
        <div key={labels[i] || i} className="flex flex-col items-center flex-1 group">
          <div
            className={`w-3 rounded transition-all group-hover:w-4 ${colors[i % colors.length]}`}
            style={{ height: `${height}px` }}
          />
          <span className="text-[10px] text-slate-500 mt-1 font-mono">{labels[i]}</span>
        </div>
      );
    })}
  </div>
);

const AdminDashboard = () => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardMetric, setLeaderboardMetric] = useState('hours');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [statsRes, historyRes, leaderboardRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getRecentHistory(20),
          adminAPI.getLeaderboard(10, leaderboardMetric)
        ]);
        setStats(statsRes.data.data || {});
        setHistory(historyRes.data.data || []);
        setLeaderboard(leaderboardRes.data.data || []);
      } catch (fetchError) {
        console.error('Failed to load dashboard data', fetchError);
        const status = fetchError.response?.status;
        if (status === 401) {
          setError('Your session expired. Please log in again.');
        } else if (status === 403) {
          setError('This account is not an admin account, so the admin dashboard data cannot be loaded.');
        } else {
          setError('Unable to load admin dashboard data right now. Please check that the server is running and try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [leaderboardMetric]);

  const change = stats.userGrowthPercent || 0;
  const completionRate = stats.completionRate || '0';
  const avgRating = stats.avgRating || '0';
  const monthlyRevenue = stats.monthlyRevenue || [];
  const monthlyEnrollments = stats.monthlyEnrollments || [];
  const topCourses = stats.topCourses || [];
  const chartLabels = monthlyRevenue.length
    ? monthlyRevenue.map((item) => item.label)
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const chartData = {
    revenue: monthlyRevenue.length ? monthlyRevenue.map((item) => item.value) : [0, 0, 0, 0, 0, 0],
    enrollments: monthlyEnrollments.length ? monthlyEnrollments.map((item) => item.value) : [0, 0, 0, 0, 0, 0]
  };

  const recentActivity = history
    .map((item) => ({
      user: item.user?.name || item.instructor?.name || 'User',
      action: item.course?.title ? `${item.action} ${item.course.title}` : item.action || item.type,
      time: 'recent',
      type: item.type === 'enrollment' ? 'info' : item.type === 'registration' ? 'success' : 'warning'
    }))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm sticky top-0 z-20 px-8 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Welcome back! Here&apos;s what&apos;s happening</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Quick search..."
                className="pl-10 pr-4 py-2.5 bg-white/70 backdrop-blur border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-400 transition-all w-72"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            </div>

            <button className="relative p-2.5 rounded-2xl bg-white/70 backdrop-blur border border-slate-200 hover:shadow-md transition-all text-slate-600 hover:text-slate-900">
              <span className="relative">🔔</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-slate-400 hover:-translate-y-0.5 transition-all"
            >
              <span>↗</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 pb-12 pt-2">
        {loading && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
            Loading admin dashboard data...
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats.totalStudents || 0}
            subtitle={`${stats.totalActiveStudents || 0} active in 30 days`}
            icon="👥"
            change={change}
            color="from-blue-500 via-indigo-500 to-purple-500"
          />

          <StatCard
            title="Total Courses"
            value={stats.totalCourses || 0}
            subtitle={`${stats.activeCourses || 0} published`}
            icon="📚"
            onClick={() => navigate('/admin/courses')}
            className="cursor-pointer hover:shadow-xl"
            change={5}
            color="from-emerald-500 via-teal-500 to-green-500"
          />

          <StatCard
            title="Learning Rate"
            value={`${completionRate}%`}
            subtitle="Completed enrollments"
            icon="✅"
            change={3}
            color="from-violet-500 to-purple-500"
          />

          <StatCard
            title="Avg Rating"
            value={avgRating}
            subtitle="Across rated courses"
            icon="⭐"
            change={1}
            color="from-orange-500 to-amber-500"
          />

          <StatCard
            title="Enrolled Students"
            value={stats.totalEnrolledStudents || 0}
            subtitle="Unique learners"
            icon="👨‍🎓"
            change={8}
            color="from-teal-500 to-emerald-500"
            onClick={() => navigate('/admin/users')}
            className="cursor-pointer hover:shadow-xl"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2 bg-white/70 backdrop-blur rounded-3xl p-8 border border-slate-200/50 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">Platform Metrics</h2>
                <p className="text-sm text-slate-500">Revenue and enrollment trends</p>
              </div>
              <div className="flex gap-2 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">📈 Revenue</span>
                <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full">👥 Enrollments</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div className="space-y-4">
                <MiniBarChart
                  data={chartData.revenue}
                  labels={chartLabels}
                  colors={['from-blue-500 to-indigo-500', 'from-indigo-500 to-purple-500']}
                />
              </div>
              <div className="space-y-4">
                <MiniBarChart
                  data={chartData.enrollments}
                  labels={chartLabels}
                  colors={['from-emerald-500 to-teal-500', 'from-teal-500 to-green-500']}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center text-xs">
              <div>
                <p className="text-2xl font-black text-blue-600 mb-1">${(stats.totalRevenue || 0).toFixed(2)}</p>
                <p className="text-slate-500 font-medium">Revenue Last 6 Months</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-600 mb-1">{stats.totalEnrollments || 0}</p>
                <p className="text-slate-500 font-medium">Total Enrollments</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur rounded-3xl p-6 border border-slate-200/50 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black text-slate-900 flex-1">Live Activity</h3>
              <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full">Live</span>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div
                  key={`${activity.user}-${idx}`}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5 ${
                    activity.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 border'
                      : activity.type === 'info'
                        ? 'bg-blue-50 border-blue-200 border'
                        : 'bg-amber-50 border-amber-200 border'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'success'
                        ? 'bg-emerald-500'
                        : activity.type === 'info'
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900">{activity.user}</p>
                    <p className="text-xs text-slate-600">{activity.action}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono whitespace-nowrap">{activity.time}</span>
                </div>
              ))}

              {!recentActivity.length && (
                <div className="p-4 text-sm text-slate-500 bg-slate-50 rounded-xl">No recent activity yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur rounded-3xl p-8 border border-slate-200/50 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-slate-900">🏆 Student Leaderboard</h3>
              <select
                value={leaderboardMetric}
                onChange={(e) => setLeaderboardMetric(e.target.value)}
                className="text-sm border border-slate-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="hours">Top Study Hours</option>
                <option value="courses">Completed Courses</option>
                <option value="rating">Avg Rating</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
                    <th className="text-left p-4 font-bold text-slate-700 text-sm uppercase tracking-wide w-12">Rank</th>
                    <th className="text-left p-4 font-bold text-slate-700 text-sm uppercase tracking-wide">Student</th>
                    <th className="text-right p-4 font-bold text-slate-700 text-sm uppercase tracking-wide w-32">Hours</th>
                    <th className="text-right p-4 font-bold text-slate-700 text-sm uppercase tracking-wide w-32">Courses</th>
                    <th className="text-right p-4 font-bold text-slate-700 text-sm uppercase tracking-wide w-24">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((student, idx) => (
                    <tr key={student._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-xl text-indigo-600">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-slate-900 truncate max-w-xs">{student.username}</p>
                          <p className="text-xs text-slate-500 truncate max-w-xs">{student.email}</p>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-slate-900 text-lg">{Math.round((student.totalHours || 0) / 60)}h</td>
                      <td className="p-4 text-right font-mono text-slate-900 text-lg">{student.completedCourses || 0}</td>
                      <td className="p-4 text-right font-mono text-slate-900 text-lg">{(student.avgRating || 0).toFixed(1)}⭐</td>
                    </tr>
                  ))}
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        No student data yet. Encourage learning activity!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur rounded-3xl p-8 border border-slate-200/50 shadow-xl">
            <h3 className="text-xl font-black text-slate-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Manage Users', icon: '👤', onClick: () => navigate('/admin/users') },
                { label: 'Manage Courses', icon: '📚', onClick: () => navigate('/admin/courses') },
                { label: 'Refresh Stats', icon: '🔄', onClick: () => window.location.reload() },
                { label: 'View Courses', icon: '🎯', onClick: () => navigate('/courses') }
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="group flex items-center gap-3 p-4 border-2 border-slate-200/50 rounded-2xl hover:border-slate-400 hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-r hover:from-slate-50"
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="font-bold text-slate-900 group-hover:text-slate-800">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur rounded-3xl p-6 border border-slate-200/50 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Top Courses</h3>
            </div>

            <div className="space-y-3">
              {topCourses.slice(0, 3).map((course) => (
                <div key={course._id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl group hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {course.category?.slice(0, 2).toUpperCase() || 'C'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{course.title}</p>
                      <p className="text-xs text-slate-500">
                        ⭐ {(course.avgRating || 0).toFixed(1)} · {course.enrollmentCount || 0} enrollments
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{course.category}</p>
                  </div>
                </div>
              ))}

              {!topCourses.length && (
                <div className="p-4 text-sm text-slate-500 bg-slate-50 rounded-xl">No course performance data yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
