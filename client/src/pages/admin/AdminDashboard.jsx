import React, { useState } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats] = useState({
    totalUsers: 12847,
    activeCourses: 234,
    totalRevenue: 482950,
    enrollments: 8943
  });
  
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student', status: 'Active', joined: '2024-01-15' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'Instructor', status: 'Active', joined: '2024-01-10' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Student', status: 'Inactive', joined: '2024-01-20' },
    { id: 4, name: 'Emily Brown', email: 'emily@example.com', role: 'Student', status: 'Active', joined: '2024-01-25' },
    { id: 5, name: 'David Lee', email: 'david@example.com', role: 'Instructor', status: 'Active', joined: '2024-01-12' }
  ]);

  const [courses] = useState([
    { id: 1, title: 'Machine Learning Fundamentals', instructor: 'Sarah Smith', students: 1234, rating: 4.8, status: 'Active', revenue: 49300 },
    { id: 2, title: 'Web Development Bootcamp', instructor: 'David Lee', students: 2341, rating: 4.9, status: 'Active', revenue: 93640 },
    { id: 3, title: 'Data Science with Python', instructor: 'Sarah Smith', students: 987, rating: 4.7, status: 'Active', revenue: 39480 },
    { id: 4, title: 'Mobile App Development', instructor: 'David Lee', students: 756, rating: 4.6, status: 'Draft', revenue: 0 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const StatCard = ({ title, value, change, icon, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </span>
            <span className="text-gray-500 text-xs">vs last month</span>
          </div>
        </div>
        <div className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 shadow-xl z-50">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            CourseAI Admin
          </h1>
          <p className="text-sm text-gray-500 mt-1">Management Dashboard</p>
        </div>

        <nav className="p-4 space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'users', label: 'User Management', icon: '👥' },
            { id: 'courses', label: 'Course Management', icon: '📚' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'payments', label: 'Payments', icon: '💳' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@courseai.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 p-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'courses' && 'Course Management'}
                {activeTab === 'analytics' && 'Analytics & Reports'}
                {activeTab === 'payments' && 'Payment Management'}
                {activeTab === 'settings' && 'System Settings'}
              </h2>
              <p className="text-gray-600">
                {activeTab === 'overview' && 'Welcome back! Here\'s what\'s happening with your platform'}
                {activeTab === 'users' && 'Manage all users, roles, and permissions'}
                {activeTab === 'courses' && 'Manage courses, content, and instructors'}
                {activeTab === 'analytics' && 'View detailed analytics and insights'}
                {activeTab === 'payments' && 'Track revenue and manage transactions'}
                {activeTab === 'settings' && 'Configure platform settings and preferences'}
              </p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
              + New {activeTab === 'users' ? 'User' : activeTab === 'courses' ? 'Course' : 'Item'}
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={stats.totalUsers.toLocaleString()}
                change={12.5}
                icon="👥"
                color="text-blue-600"
              />
              <StatCard
                title="Active Courses"
                value={stats.activeCourses}
                change={8.3}
                icon="📚"
                color="text-purple-600"
              />
              <StatCard
                title="Total Revenue"
                value={`$${(stats.totalRevenue / 1000).toFixed(1)}K`}
                change={15.2}
                icon="💰"
                color="text-emerald-600"
              />
              <StatCard
                title="Enrollments"
                value={stats.enrollments.toLocaleString()}
                change={22.8}
                icon="🎓"
                color="text-amber-600"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue Overview</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {[65, 78, 90, 45, 88, 76, 95, 82, 70, 85, 92, 88].map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-indigo-600 to-purple-600 rounded-t-lg hover:from-indigo-700 hover:to-purple-700 transition-all cursor-pointer" style={{ height: `${height}%` }}></div>
                      <span className="text-xs text-gray-500">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { user: 'John Doe', action: 'enrolled in Web Development Bootcamp', time: '2 minutes ago', color: 'bg-blue-100 text-blue-600' },
                    { user: 'Sarah Smith', action: 'published new course', time: '15 minutes ago', color: 'bg-purple-100 text-purple-600' },
                    { user: 'Mike Johnson', action: 'completed Machine Learning course', time: '1 hour ago', color: 'bg-emerald-100 text-emerald-600' },
                    { user: 'Emily Brown', action: 'left a 5-star review', time: '2 hours ago', color: 'bg-amber-100 text-amber-600' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all">
                      <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center font-semibold text-sm flex-shrink-0`}>
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium"><span className="font-semibold">{activity.user}</span> {activity.action}</p>
                        <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all">
                  <option>All Roles</option>
                  <option>Students</option>
                  <option>Instructors</option>
                  <option>Admins</option>
                </select>
                <select className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'Instructor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{user.joined}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">1</span> to <span className="font-semibold">{filteredUsers.length}</span> of <span className="font-semibold">{users.length}</span> users
                </p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border-2 border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-all">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-6xl">
                    📚
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-900 flex-1">{course.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        course.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">by {course.instructor}</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Students</span>
                        <span className="font-semibold text-gray-900">{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Rating</span>
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          <span className="font-semibold text-gray-900">{course.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Revenue</span>
                        <span className="font-semibold text-emerald-600">${course.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all">
                        Edit
                      </button>
                      <button className="px-4 py-2 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">User Growth</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {[45, 62, 58, 75, 88, 92, 98].map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg" style={{ height: `${height}%` }}></div>
                      <span className="text-xs text-gray-500">Week {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Course Completion Rate</h3>
                <div className="flex items-center justify-center h-64">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="88" fill="none" stroke="#e5e7eb" strokeWidth="16" />
                      <circle cx="96" cy="96" r="88" fill="none" stroke="url(#gradient)" strokeWidth="16" strokeDasharray="552.9" strokeDashoffset="138.2" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-bold text-gray-900">75%</span>
                      <span className="text-sm text-gray-600 mt-1">Completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Courses */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Top Performing Courses</h3>
              <div className="space-y-4">
                {courses.filter(c => c.status === 'Active').map((course, index) => (
                  <div key={course.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{course.title}</p>
                      <p className="text-sm text-gray-600">{course.students.toLocaleString()} students</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600">${course.revenue.toLocaleString()}</p>
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-amber-500 text-sm">★</span>
                        <span className="text-sm text-gray-600">{course.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <p className="text-gray-600 text-sm font-medium mb-2">Total Revenue</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">${stats.totalRevenue.toLocaleString()}</h3>
                <p className="text-emerald-600 text-sm font-semibold">↑ 23.5% from last month</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <p className="text-gray-600 text-sm font-medium mb-2">Pending Payouts</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">$24,350</h3>
                <p className="text-gray-600 text-sm">12 instructors awaiting payout</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <p className="text-gray-600 text-sm font-medium mb-2">Refund Requests</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">8</h3>
                <p className="text-amber-600 text-sm font-semibold">Requires attention</p>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Transaction ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Course</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { id: 'TXN-1234', user: 'John Doe', course: 'Web Development Bootcamp', amount: 99, status: 'Completed', date: '2024-02-15' },
                      { id: 'TXN-1235', user: 'Emily Brown', course: 'Machine Learning', amount: 149, status: 'Completed', date: '2024-02-15' },
                      { id: 'TXN-1236', user: 'Mike Johnson', course: 'Data Science', amount: 129, status: 'Pending', date: '2024-02-14' },
                      { id: 'TXN-1237', user: 'Sarah Wilson', course: 'Mobile Development', amount: 119, status: 'Completed', date: '2024-02-14' }
                    ].map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-sm text-gray-600">{transaction.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{transaction.user}</td>
                        <td className="px-6 py-4 text-gray-600">{transaction.course}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">${transaction.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            transaction.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{transaction.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Platform Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Platform Name</label>
                  <input type="text" defaultValue="CourseAI" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Support Email</label>
                  <input type="email" defaultValue="support@courseai.com" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">Maintenance Mode</p>
                    <p className="text-sm text-gray-600">Temporarily disable public access</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-lg transition-all">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;