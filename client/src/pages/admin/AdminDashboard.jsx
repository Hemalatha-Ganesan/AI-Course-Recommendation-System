import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { adminAPI } from '../../api/api';

const ICONS = {
  students: '👥', courses: '📚', revenue: '💰', enrollments: '📝',
  completion: '✅', dropout: '📉', rating: '⭐', instructors: '👩‍🏫'
};

const StatCard = ({ title, value, subtitle, icon, change, color }) => (
  <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:bg-white">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
        <span className="text-xl font-bold text-white">{icon}</span>
      </div>
      {change !== undefined && (
        <span className={`text-sm font-bold px-2 py-1 rounded-full ${
          change >= 0 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
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
      const height = Math.max(value / Math.max(...data) * 80, 10);
      return (
        <div key={i} className="flex flex-col items-center flex-1 group">
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
  const navigate = useNavigate();
  const { logout } = useUser();
  const [stats, setStats] = useState({});
  const [history, setHistory] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, historyRes, coursesRes, leaderboardRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getRecentHistory(20),
          adminAPI.getAllCourses(),
          adminAPI.getLeaderboard(10)
        ]);
        setStats(statsRes.data.data);
        setHistory(historyRes.data.data);
        setTopCourses(coursesRes.data.data.slice(0,3));
        setLeaderboard(leaderboardRes.data.data || []);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const change = stats.userGrowthPercent || 0;
  const completionRate = stats.completionRate || '0';
  const avgRating = stats.avgRating || '0';

  const chartLabels = ['Data Science', 'DevOps', 'ML', 'Web Dev', 'Python', 'Cloud'];
  const chartData = {
    revenue: stats.topCategories ? stats.topCategories.map(c => c.count) : [0,0,0,0,0,0],
    enrollments: [280, 410, 340, 480, 550, 720] 
  };
  
  const recentActivity = history.map(item => ({
    user: item.user?.name || item.instructor?.name || 'User',
    action: item.action || `${item.type} ${item.course?.title || ''}`.trim(),
    time: 'recent',
    type: item.type === 'enrollment' ? 'info' : item.type === 'registration' ? 'success' : 'warning'
  })).slice(0,4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm sticky top-0 z-20 px-8 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Welcome back! Here's what's happening</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Stats */}
<StatCard 
            title="Total Students" 
            value={stats.totalUsers || 0} 
            subtitle={`${stats.activeUsers || 0} active`}
            icon="👥"
            change={change}
            color="from-blue-500 via-indigo-500 to-purple-500"
          />
          
          <StatCard 
            title="Total Courses" 
            value={stats.totalCourses || 0} 
            subtitle={`${stats.activeCourses || 0} active`}
            icon="📚"
            change={5}
            color="from-emerald-500 via-teal-500 to-green-500"
          />
          
          <StatCard 
            title="Learning Rate" 
            value={completionRate + '%'} 
            subtitle="Completion"
            icon="✅"
            change={3}
            color="from-violet-500 to-purple-500"
          />
          
          <StatCard 
            title="Avg Rating" 
            value={avgRating}
            subtitle="⭐ All courses"
            icon="⭐"
            change={1}
            color="from-orange-500 to-amber-500"
          />

        </div>

        {/* Charts + Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          
          {/* Revenue vs Enrollments */}
          <div className="xl:col-span-2 bg-white/70 backdrop-blur rounded-3xl p-8 border border-slate-200/50 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">Platform Metrics</h2>
                <p className="text-sm text-slate-500">Revenue & Enrollment trends</p>
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
                  labels={['Jan','Feb','Mar','Apr','May','Jun']}
                  colors={['from-blue-500 to-indigo-500', 'from-indigo-500 to-purple-500']}
                />
              </div>
              <div className="space-y-4">
                <MiniBarChart 
                  data={chartData.enrollments}
                  labels={['Jan','Feb','Mar','Apr','May','Jun']}
                  colors={['from-emerald-500 to-teal-500', 'from-teal-500 to-green-500']}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center text-xs">
              <div>
                <p className="text-2xl font-black text-blue-600 mb-1">₹2.47L</p>
                <p className="text-slate-500 font-medium">Total Revenue YTD</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-600 mb-1">1,567</p>
                <p className="text-slate-500 font-medium">Total Enrollments</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/70 backdrop-blur rounded-3xl p-6 border border-slate-200/50 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black text-slate-900 flex-1">Live Activity</h3>
              <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full">Live</span>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className={`flex items-start gap-3 p-3 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5 ${
                  activity.type === 'success' ? 'bg-emerald-50 border-emerald-200 border' :
                  activity.type === 'info' ? 'bg-blue-50 border-blue-200 border' :
                  'bg-amber-50 border-amber-200 border'
                }`}>
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'success' ? 'bg-emerald-500' :
                    activity.type === 'info' ? 'bg-blue-500' :
                    'bg-amber-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900">{activity.user}</p>
                    <p className="text-xs text-slate-600">{activity.action}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur rounded-3xl p-8 border border-slate-200/50 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-slate-900">🏆 Student Leaderboard</h3>
              <select className="text-sm border border-slate-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500">
                <option>Top Study Hours</option>
                <option>Completed Courses</option>
                <option>Avg Rating</option>
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
                      <td className="p-4 font-bold text-xl text-indigo-600">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-slate-900 truncate max-w-xs">{student.username}</p>
                          <p className="text-xs text-slate-500 truncate max-w-xs">{student.email}</p>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-slate-900 text-lg">{Math.round(student.totalHours / 60)}h</td>
                      <td className="p-4 text-right font-mono text-slate-900 text-lg">{student.completedCourses}</td>
                      <td className="p-4 text-right font-mono text-slate-900 text-lg">{student.avgRating.toFixed(1)}⭐</td>
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

        {/* Quick Actions & Top Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Quick Actions */}
          <div className="bg-white/70 backdrop-blur rounded-3xl p-8 border border-slate-200/50 shadow-xl">
            <h3 className="text-xl font-black text-slate-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'New Student', icon: '➕' },
                { label: 'Upload Courses', icon: '📥' },
                { label: 'Generate Report', icon: '📊' },
                { label: 'Refund Request', icon: '↩' }
              ].map((action, idx) => (
                <button key={idx} className="group flex items-center gap-3 p-4 border-2 border-slate-200/50 rounded-2xl hover:border-slate-400 hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-r hover:from-slate-50">
                  <span className="text-2xl">{action.icon}</span>
                  <span className="font-bold text-slate-900 group-hover:text-slate-800">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Top Courses */}
          <div className="bg-white/70 backdrop-blur rounded-3xl p-6 border border-slate-200/50 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Top Courses</h3>
            </div>
            
            <div className="space-y-3">
              {topCourses.map((course, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl group hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {course.category?.slice(0,2).toUpperCase() || 'C'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{course.title}</p>
                      <p className="text-xs text-slate-500">⭐ 4.8</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{course.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

