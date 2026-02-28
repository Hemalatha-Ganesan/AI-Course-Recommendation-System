import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const UserProfile = () => {
  const { user, loading, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    phone: '',
    profileImage: '',
  });

  // ✅ Fix: Sync formData when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        phone: user.phone || '',
        profileImage: user.profileImage || '',
      });
    }
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Please log in to view your profile
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // Add API call here to save profile
    console.log('Saving profile:', formData);
    setEditMode(false);
  };

  // ✅ Fix: Static color maps instead of dynamic Tailwind classes
  const statColorMap = {
    emerald: {
      wrapper: 'bg-emerald-50 border-emerald-100',
      label: 'text-emerald-900',
      value: 'text-emerald-600',
    },
    blue: {
      wrapper: 'bg-blue-50 border-blue-100',
      label: 'text-blue-900',
      value: 'text-blue-600',
    },
    orange: {
      wrapper: 'bg-orange-50 border-orange-100',
      label: 'text-orange-900',
      value: 'text-orange-600',
    },
    yellow: {
      wrapper: 'bg-yellow-50 border-yellow-100',
      label: 'text-yellow-900',
      value: 'text-yellow-600',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">My Profile</h1>
          <p className="text-indigo-100 text-lg mt-2">Manage your account and preferences</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Profile Card / Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-4">
              {/* Profile Avatar */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.username}</h2>
                <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
                <span className={`mt-3 px-4 py-1 rounded-full text-xs font-semibold ${
                  user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {user?.role === 'admin' ? 'Admin User' : 'Student'}
                </span>
              </div>

              {/* Navigation */}
              <div className="mt-8 space-y-2">
                {[
                  { id: 'profile', label: 'Profile Info', icon: '👤' },
                  { id: 'preferences', label: 'Preferences', icon: '⚙️' },
                  { id: 'security', label: 'Security', icon: '🔒' },
                  { id: 'learning', label: 'Learning Stats', icon: '📊' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full mt-8 px-4 py-3 border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">

            {/* ── Profile Tab ── */}
            {activeTab === 'profile' && (
              <div className="space-y-6">

                {/* Progress Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold text-violet-700 uppercase tracking-wider">Total Courses</p>
                      <span className="text-3xl">📚</span>
                    </div>
                    <h3 className="text-4xl font-black text-violet-900">5</h3>
                    <p className="text-xs text-violet-600 mt-2">Enrolled in 5 courses</p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Completed</p>
                      <span className="text-3xl">✅</span>
                    </div>
                    <h3 className="text-4xl font-black text-emerald-900">2</h3>
                    <p className="text-xs text-emerald-600 mt-2">Courses successfully finished</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold text-blue-700 uppercase tracking-wider">Avg Rating</p>
                      <span className="text-3xl">⭐</span>
                    </div>
                    <h3 className="text-4xl font-black text-blue-900">4.7</h3>
                    <p className="text-xs text-blue-600 mt-2">Overall performance rating</p>
                  </div>
                </div>

                {/* Learning Progress */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">📖 Learning Progress</h3>
                  <div className="space-y-4">
                    {[
                      { course: 'Web Development Bootcamp', progress: 85, instructor: 'David Lee' },
                      { course: 'Machine Learning Fundamentals', progress: 60, instructor: 'Sarah Smith' },
                      { course: 'Data Science with Python', progress: 45, instructor: 'Sarah Smith' },
                      { course: 'UI/UX Design Masterclass', progress: 100, instructor: 'Emma Chen' },
                      { course: 'Cloud Architecture & AWS', progress: 30, instructor: 'James Wilson' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100/50 transition">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-gray-900">{item.course}</p>
                            <p className="text-xs text-gray-500">by {item.instructor}</p>
                          </div>
                          <span className={`text-sm font-black px-3 py-1 rounded-full ${
                            item.progress === 100 ? 'bg-emerald-100 text-emerald-700' :
                            item.progress >= 75 ? 'bg-blue-100 text-blue-700' :
                            item.progress >= 50 ? 'bg-amber-100 text-amber-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {item.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.progress === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                              item.progress >= 75 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                              item.progress >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                              'bg-gradient-to-r from-orange-500 to-red-500'
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profile Information Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Profile Information</h2>
                    {!editMode && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {editMode ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself..."
                          rows="4"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={handleSaveProfile}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditMode(false)}
                          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-gray-600 font-semibold mb-1">Username</p>
                          <p className="text-lg font-bold text-gray-900">{formData.username}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-gray-600 font-semibold mb-1">Email</p>
                          <p className="text-lg font-bold text-gray-900">{formData.email}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-gray-600 font-semibold mb-1">Phone</p>
                          <p className="text-lg font-bold text-gray-900">{formData.phone || 'Not provided'}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-gray-600 font-semibold mb-1">Member Since</p>
                          <p className="text-lg font-bold text-gray-900">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      {formData.bio && (
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-gray-600 font-semibold mb-2">Bio</p>
                          <p className="text-gray-700">{formData.bio}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ── Preferences Tab ── */}
            {activeTab === 'preferences' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Preferences</h2>
                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive course updates and announcements</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* Marketing Emails */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900">Marketing Emails</p>
                      <p className="text-sm text-gray-600">New courses and special offers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* Weekly Digest */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900">Weekly Digest</p>
                      <p className="text-sm text-gray-600">Summary of your learning progress</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* Theme Selection */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-semibold text-gray-900 mb-3">Theme</p>
                    <select className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none">
                      <option>Light (Default)</option>
                      <option>Dark</option>
                      <option>Auto</option>
                    </select>
                  </div>

                  {/* Language Selection */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-semibold text-gray-900 mb-3">Language</p>
                    <select className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>

                  <button className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* ── Security Tab ── */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Security & Privacy</h2>
                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-semibold text-gray-900">Password</p>
                        <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                        Change Password
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                    <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-white transition">
                      Enable
                    </button>
                  </div>

                  {/* Active Sessions */}
                  <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <p className="font-semibold text-gray-900 mb-4">Active Sessions</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Chrome on Windows</p>
                          <p className="text-xs text-gray-500">Last active: Today</p>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                          Current
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="p-6 bg-red-50 rounded-xl border-2 border-red-200">
                    <p className="font-semibold text-red-900 mb-2">Delete Account</p>
                    <p className="text-sm text-red-700 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Learning Stats Tab ── */}
            {activeTab === 'learning' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Learning Statistics</h2>

                {/* ✅ Fix: static color classes instead of dynamic template strings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {[
                    { label: 'Courses Completed', value: '5', icon: '✅', color: 'emerald' },
                    { label: 'Total Study Time', value: '48 hrs', icon: '⏱️', color: 'blue' },
                    { label: 'Current Streak', value: '12 days', icon: '🔥', color: 'orange' },
                    { label: 'Achievements', value: '8', icon: '🏆', color: 'yellow' },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className={`p-6 rounded-xl border-2 ${statColorMap[stat.color].wrapper}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-semibold mb-2 ${statColorMap[stat.color].label}`}>
                            {stat.label}
                          </p>
                          <p className={`text-3xl font-bold ${statColorMap[stat.color].value}`}>
                            {stat.value}
                          </p>
                        </div>
                        <span className="text-4xl">{stat.icon}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Learning Breakdown */}
                <div className="p-6 bg-gray-50 rounded-xl">
                  <p className="font-semibold text-gray-900 mb-4">Learning Breakdown</p>
                  <div className="space-y-3">
                    {[
                      { category: 'Web Development', hours: 24, percentage: 50 },
                      { category: 'Data Science', hours: 16, percentage: 33 },
                      { category: 'Mobile Apps', hours: 8, percentage: 17 },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-gray-900">{item.category}</span>
                          <span className="text-sm text-gray-600">{item.hours} hours</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;