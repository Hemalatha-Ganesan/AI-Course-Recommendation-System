import React, { useState } from 'react';

// ─── DATA ───────────────────────────────────────────────────────────────────
const STUDENTS = [
  { id: 'STU-001', name: 'Arjun Mehta',     email: 'arjun.mehta@gmail.com',   phone: '+91 98765 43210', avatar: 'AM', courses: ['Machine Learning','Web Dev Bootcamp'], progress: 78, grade: 'A',  status: 'Active',   joined: '2024-01-15', location: 'Mumbai', totalSpent: 248, lastActive: '2 hrs ago',   completedCourses: 1 },
  { id: 'STU-002', name: 'Priya Sharma',    email: 'priya.sharma@yahoo.com',   phone: '+91 87654 32109', avatar: 'PS', courses: ['Data Science'],              progress: 55, grade: 'B+', status: 'Active',   joined: '2024-01-20', location: 'Delhi',  totalSpent: 129, lastActive: '1 day ago',   completedCourses: 0 },
  { id: 'STU-003', name: 'Rahul Verma',     email: 'rahul.verma@outlook.com',  phone: '+91 76543 21098', avatar: 'RV', courses: ['Web Dev Bootcamp'],          progress: 92, grade: 'A+', status: 'Active',   joined: '2024-02-01', location: 'Pune',   totalSpent: 99,  lastActive: '30 min ago',  completedCourses: 2 },
  { id: 'STU-004', name: 'Sneha Patel',     email: 'sneha.patel@gmail.com',    phone: '+91 65432 10987', avatar: 'SP', courses: ['Mobile App Dev'],            progress: 34, grade: 'C',  status: 'Inactive', joined: '2024-01-10', location: 'Ahm.',   totalSpent: 119, lastActive: '2 weeks ago', completedCourses: 0 },
  { id: 'STU-005', name: 'Vikram Singh',    email: 'vikram.singh@hotmail.com', phone: '+91 54321 09876', avatar: 'VS', courses: ['Machine Learning','Data Science'], progress: 65, grade: 'B', status: 'Active', joined: '2024-02-10', location: 'Jaipur', totalSpent: 278, lastActive: '5 hrs ago',  completedCourses: 1 },
  { id: 'STU-006', name: 'Ananya Roy',      email: 'ananya.roy@gmail.com',     phone: '+91 43210 98765', avatar: 'AR', courses: ['Web Dev Bootcamp'],          progress: 100, grade: 'A+', status: 'Completed', joined: '2024-01-05', location: 'Kolkata', totalSpent: 99, lastActive: '3 days ago', completedCourses: 3 },
  { id: 'STU-007', name: 'Karthik Nair',   email: 'karthik.nair@gmail.com',   phone: '+91 32109 87654', avatar: 'KN', courses: ['Data Science','ML'],         progress: 88, grade: 'A',  status: 'Active',   joined: '2024-02-15', location: 'Chennai', totalSpent: 278, lastActive: '1 hr ago',   completedCourses: 1 },
  { id: 'STU-008', name: 'Divya Krishnan', email: 'divya.k@outlook.com',      phone: '+91 21098 76543', avatar: 'DK', courses: ['Machine Learning'],          progress: 41, grade: 'B-', status: 'At Risk',  joined: '2024-01-25', location: 'Hyd.',   totalSpent: 149, lastActive: '1 week ago',  completedCourses: 0 },
];

const COURSES = [
  { id: 'CRS-001', title: 'Machine Learning Fundamentals', instructor: 'Sarah Smith',  category: 'AI/ML',      students: 1234, capacity: 2000, rating: 4.8, reviews: 891,  status: 'Active',  revenue: 183866, price: 149, completionRate: 72, thumbnail: '🤖', duration: '48 hrs', level: 'Intermediate', modules: 12, lastUpdated: '2024-02-10' },
  { id: 'CRS-002', title: 'Web Development Bootcamp',      instructor: 'David Lee',    category: 'Web Dev',    students: 2341, capacity: 3000, rating: 4.9, reviews: 1876, status: 'Active',  revenue: 231759, price: 99,  completionRate: 81, thumbnail: '💻', duration: '60 hrs', level: 'Beginner',     modules: 18, lastUpdated: '2024-02-12' },
  { id: 'CRS-003', title: 'Data Science with Python',      instructor: 'Sarah Smith',  category: 'Data',       students: 987,  capacity: 1500, rating: 4.7, reviews: 732,  status: 'Active',  revenue: 127323, price: 129, completionRate: 68, thumbnail: '📊', duration: '52 hrs', level: 'Intermediate', modules: 14, lastUpdated: '2024-02-08' },
  { id: 'CRS-004', title: 'Mobile App Development',        instructor: 'David Lee',    category: 'Mobile',     students: 756,  capacity: 1000, rating: 4.6, reviews: 543,  status: 'Draft',   revenue: 0,      price: 119, completionRate: 0,  thumbnail: '📱', duration: '44 hrs', level: 'Intermediate', modules: 10, lastUpdated: '2024-02-14' },
  { id: 'CRS-005', title: 'Cloud Architecture & AWS',      instructor: 'James Wilson', category: 'Cloud',      students: 543,  capacity: 800,  rating: 4.5, reviews: 301,  status: 'Active',  revenue: 64617,  price: 119, completionRate: 59, thumbnail: '☁️', duration: '36 hrs', level: 'Advanced',     modules: 9,  lastUpdated: '2024-01-30' },
  { id: 'CRS-006', title: 'UI/UX Design Masterclass',      instructor: 'Emma Chen',    category: 'Design',     students: 876,  capacity: 1200, rating: 4.8, reviews: 654,  status: 'Active',  revenue: 96360,  price: 110, completionRate: 76, thumbnail: '🎨', duration: '40 hrs', level: 'Beginner',     modules: 11, lastUpdated: '2024-02-05' },
];

const TRANSACTIONS = [
  { id: 'TXN-4521', student: 'Arjun Mehta',    course: 'Machine Learning',    amount: 149, status: 'Completed', date: '2024-02-15', method: 'Card' },
  { id: 'TXN-4520', student: 'Priya Sharma',   course: 'Data Science',        amount: 129, status: 'Completed', date: '2024-02-15', method: 'UPI'  },
  { id: 'TXN-4519', student: 'Rahul Verma',    course: 'Web Dev Bootcamp',    amount: 99,  status: 'Refunded',  date: '2024-02-14', method: 'Card' },
  { id: 'TXN-4518', student: 'Vikram Singh',   course: 'Data Science',        amount: 129, status: 'Completed', date: '2024-02-14', method: 'Net Banking' },
  { id: 'TXN-4517', student: 'Ananya Roy',     course: 'Web Dev Bootcamp',    amount: 99,  status: 'Pending',   date: '2024-02-13', method: 'UPI'  },
  { id: 'TXN-4516', student: 'Karthik Nair',   course: 'Machine Learning',    amount: 149, status: 'Completed', date: '2024-02-13', method: 'Card' },
  { id: 'TXN-4515', student: 'Sneha Patel',    course: 'Mobile App Dev',      amount: 119, status: 'Failed',    date: '2024-02-12', method: 'Card' },
  { id: 'TXN-4514', student: 'Divya Krishnan', course: 'Machine Learning',    amount: 149, status: 'Completed', date: '2024-02-12', method: 'UPI'  },
];

const REVENUE_DATA  = [42, 58, 51, 67, 74, 88, 72, 95, 83, 91, 97, 89];
const ENROLL_DATA   = [30, 45, 38, 55, 62, 78, 65, 82, 70, 88, 94, 86];
const MONTHS        = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── HELPERS ────────────────────────────────────────────────────────────────
const fmt = n => n >= 1000 ? `${(n/1000).toFixed(1)}K` : n;
const currency = n => `₹${n.toLocaleString()}`;
const pct = (a, b) => Math.round((a / b) * 100);

const STATUS_COLORS = {
  Active:    'bg-emerald-100 text-emerald-700 border-emerald-200',
  Inactive:  'bg-slate-100   text-slate-500   border-slate-200',
  Completed: 'bg-blue-100    text-blue-700    border-blue-200',
  'At Risk': 'bg-red-100     text-red-700     border-red-200',
  Draft:     'bg-amber-100   text-amber-700   border-amber-200',
  Refunded:  'bg-orange-100  text-orange-700  border-orange-200',
  Pending:   'bg-yellow-100  text-yellow-700  border-yellow-200',
  Failed:    'bg-red-100     text-red-700     border-red-200',
};

const GRADE_COLORS = {
  'A+': 'text-emerald-600', 'A': 'text-emerald-500',
  'B+': 'text-blue-600',    'B': 'text-blue-500', 'B-': 'text-blue-400',
  'C': 'text-amber-500',
};

function Avatar({ initials, size = 'md', gradient = 'from-violet-600 to-indigo-600' }) {
  const s = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' }[size];
  return (
    <div className={`${s} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

function Badge({ label }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[label] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {label}
    </span>
  );
}

function ProgressBar({ value, color = 'from-violet-500 to-indigo-500' }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-600 w-8 text-right">{value}%</span>
    </div>
  );
}

// ─── MINI CHART ─────────────────────────────────────────────────────────────
function BarChart({ data, color = 'from-violet-600 to-indigo-600', labels }) {
  const max = Math.max(...data);
  return (
    <div className="h-40 flex items-end gap-1.5">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="relative w-full">
            <div
              className={`w-full bg-gradient-to-t ${color} rounded-t-sm opacity-80 group-hover:opacity-100 transition-all cursor-pointer`}
              style={{ height: `${Math.round((v / max) * 130)}px` }}
            />
          </div>
          {labels && <span className="text-[10px] text-slate-400">{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ title, value, sub, icon, change, gradient }) {
  const pos = change >= 0;
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${gradient} flex items-center justify-center text-xl`}>{icon}</div>
        {change !== undefined && (
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${pos ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {pos ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-slate-900 mb-0.5">{value}</p>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab]           = useState('overview');
  const [search, setSearch]     = useState('');
  const [roleFilter, setRoleFilter]   = useState('All');
  const [statusFilter, setStatus] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourse, setSelectedCourse]   = useState(null);
  const [notification, setNotification]       = useState(null);
  const [sidebarOpen, setSidebarOpen]         = useState(true);

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Derived stats
  const totalStudents  = STUDENTS.length;
  const activeStudents = STUDENTS.filter(s => s.status === 'Active').length;
  const atRisk         = STUDENTS.filter(s => s.status === 'At Risk').length;
  const totalRevenue   = TRANSACTIONS.filter(t => t.status === 'Completed').reduce((a, t) => a + t.amount, 0);
  const totalEnrolls   = COURSES.reduce((a, c) => a + c.students, 0);
  const avgCompletion  = Math.round(COURSES.filter(c=>c.status==='Active').reduce((a,c)=>a+c.completionRate,0)/COURSES.filter(c=>c.status==='Active').length);

  const filteredStudents = STUDENTS.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
    const matchRole   = roleFilter === 'All' || s.status === roleFilter;
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const NAV = [
    { id: 'overview',  label: 'Overview',        icon: '⬡' },
    { id: 'students',  label: 'Students',         icon: '🎓' },
    { id: 'courses',   label: 'Courses',          icon: '📚' },
    { id: 'analytics', label: 'Analytics',        icon: '📊' },
    { id: 'payments',  label: 'Payments',         icon: '💳' },
    { id: 'reports',   label: 'Reports',          icon: '📋' },
    { id: 'settings',  label: 'Settings',         icon: '⚙️' },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }} className="min-h-screen flex bg-[#F4F6FB] text-slate-800">

      {/* GLOBAL FONT */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .tab-active { background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; box-shadow: 0 4px 12px rgba(124,58,237,0.3); }
      `}</style>

      {/* NOTIFICATION */}
      {notification && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all ${notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {notification.type === 'success' ? '✓' : '✕'} {notification.msg}
        </div>
      )}

      {/* ── SIDEBAR ──────────────────────────────────────────────────────────── */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} transition-all duration-300 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col min-h-screen sticky top-0 h-screen shadow-sm`}>
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black text-base flex-shrink-0">
            A
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-black text-base text-slate-900 leading-none">AcademAI</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Admin Console</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto text-slate-400 hover:text-slate-600 transition-colors">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${tab === item.id ? 'tab-active' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Alerts section */}
        {sidebarOpen && (
          <div className="p-3 border-t border-slate-100">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-xs font-bold text-red-700 mb-1">⚠ Alerts</p>
              <p className="text-xs text-red-600">{atRisk} students at risk</p>
              <p className="text-xs text-red-600">8 pending refunds</p>
            </div>
          </div>
        )}

        {/* Admin Profile */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition">
            <Avatar initials="AD" size="sm" gradient="from-violet-600 to-indigo-600" />
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">Admin User</p>
                <p className="text-[10px] text-slate-400 truncate">Super Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* TOP BAR */}
        <header className="bg-white border-b border-slate-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div>
            <h1 className="text-lg font-black text-slate-900 capitalize">{tab === 'overview' ? 'Dashboard Overview' : tab}</h1>
            <p className="text-xs text-slate-400 font-medium">Wednesday, 25 Feb 2026 · Academic Year 2025-26</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Quick search…"
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all w-52"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            </div>
            <button className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-slate-600">
              🔔
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button
              onClick={() => notify('Exported successfully!')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-violet-300 hover:-translate-y-0.5 transition-all"
            >
              ↓ Export
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-auto">

          {/* ════ OVERVIEW ════════════════════════════════════════════════════ */}
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Students"   value={totalStudents}           icon="🎓" gradient="bg-violet-50"  change={12.5} sub={`${activeStudents} active`} />
                <StatCard title="Active Courses"   value={COURSES.filter(c=>c.status==='Active').length} icon="📚" gradient="bg-indigo-50" change={8.3} sub="1 in draft" />
                <StatCard title="Total Enrollments" value={fmt(totalEnrolls)}      icon="📝" gradient="bg-blue-50"   change={22.8} sub="Across all courses" />
                <StatCard title="Total Revenue"    value={currency(totalRevenue)}  icon="💰" gradient="bg-emerald-50" change={18.4} sub="This month" />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Avg Completion"  value={`${avgCompletion}%`}   icon="✅" gradient="bg-teal-50"  change={5.2} />
                <StatCard title="At-Risk Students" value={atRisk}               icon="⚠️" gradient="bg-red-50"   change={-2.1} sub="Need attention" />
                <StatCard title="Avg Rating"      value="4.76 ★"               icon="⭐" gradient="bg-amber-50" change={1.3} />
                <StatCard title="Instructors"     value="4"                    icon="👩‍🏫" gradient="bg-pink-50"  sub="2 active" />
              </div>

              {/* Charts + Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-black text-slate-900">Revenue Overview</h3>
                      <p className="text-xs text-slate-400">Monthly revenue — 2024</p>
                    </div>
                    <div className="flex gap-2">
                      {['Revenue','Enrollments'].map((l,i) => (
                        <div key={l} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                          <div className={`w-2.5 h-2.5 rounded-full ${i===0?'bg-violet-500':'bg-indigo-300'}`} />
                          {l}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 mb-1 font-medium">Revenue</p>
                      <BarChart data={REVENUE_DATA} labels={MONTHS} color="from-violet-600 to-indigo-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 mb-1 font-medium">Enrollments</p>
                      <BarChart data={ENROLL_DATA} labels={MONTHS} color="from-indigo-400 to-blue-400" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <h3 className="font-black text-slate-900 mb-4">Live Activity</h3>
                  <div className="space-y-3">
                    {[
                      { user:'Rahul Verma',  action:'completed Web Dev Bootcamp', time:'2m',  color:'from-emerald-500 to-teal-500' },
                      { user:'Arjun Mehta',  action:'enrolled in Machine Learning', time:'8m',  color:'from-violet-500 to-indigo-500' },
                      { user:'Karthik Nair', action:'scored A+ in quiz',          time:'22m', color:'from-amber-500 to-orange-500' },
                      { user:'Priya Sharma', action:'started Data Science',       time:'1h',  color:'from-blue-500 to-indigo-500' },
                      { user:'Divya K.',     action:'missed 3 assignments',       time:'2h',  color:'from-red-500 to-pink-500' },
                    ].map((a,i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${a.color} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                          {a.user.split(' ').map(x=>x[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 leading-tight">{a.user} <span className="font-normal text-slate-500">{a.action}</span></p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{a.time} ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Students + Top Courses mini tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <h3 className="font-black text-slate-900 mb-4">Top Students</h3>
                  {STUDENTS.filter(s=>s.status!=='Inactive').sort((a,b)=>b.progress-a.progress).slice(0,5).map((s,i) => (
                    <div key={s.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                      <span className="text-xs font-black text-slate-300 w-4">#{i+1}</span>
                      <Avatar initials={s.avatar} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{s.name}</p>
                        <ProgressBar value={s.progress} />
                      </div>
                      <span className={`text-sm font-black ${GRADE_COLORS[s.grade]}`}>{s.grade}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <h3 className="font-black text-slate-900 mb-4">Top Courses</h3>
                  {COURSES.filter(c=>c.status==='Active').sort((a,b)=>b.revenue-a.revenue).slice(0,5).map((c,i) => (
                    <div key={c.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                      <span className="text-xs font-black text-slate-300 w-4">#{i+1}</span>
                      <span className="text-xl">{c.thumbnail}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{c.title}</p>
                        <p className="text-[10px] text-slate-400">{c.students.toLocaleString()} students</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">₹{fmt(c.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ STUDENTS ════════════════════════════════════════════════════ */}
          {tab === 'students' && !selectedStudent && (
            <div className="space-y-5">
              {/* Stat mini-cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label:'Total Students', val: totalStudents,   color:'bg-violet-50 text-violet-700' },
                  { label:'Active',         val: activeStudents,  color:'bg-emerald-50 text-emerald-700' },
                  { label:'At Risk',        val: atRisk,          color:'bg-red-50 text-red-700' },
                  { label:'Completed',      val: STUDENTS.filter(s=>s.status==='Completed').length, color:'bg-blue-50 text-blue-700' },
                ].map(m => (
                  <div key={m.label} className={`${m.color} rounded-xl p-4`}>
                    <p className="text-2xl font-black">{m.val}</p>
                    <p className="text-xs font-semibold mt-0.5 opacity-70">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                  <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name, email, or ID…"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                  />
                </div>
                {['All','Active','Inactive','At Risk','Completed'].map(s => (
                  <button key={s} onClick={() => setStatus(s)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter===s ? 'bg-violet-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {s}
                  </button>
                ))}
                <button onClick={() => notify('Exported student list!')} className="ml-auto px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition">↓ Export CSV</button>
              </div>

              {/* Student Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        {['Student','ID','Email','Courses','Progress','Grade','Status','Spent','Last Active','Actions'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredStudents.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar initials={s.avatar} size="sm" />
                              <div>
                                <p className="text-sm font-bold text-slate-900 whitespace-nowrap">{s.name}</p>
                                <p className="text-[10px] text-slate-400">{s.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 mono text-xs text-slate-500">{s.id}</td>
                          <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{s.email}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-0.5">
                              {s.courses.map(c => <span key={c} className="text-[10px] bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">{c.length>18?c.slice(0,18)+'…':c}</span>)}
                            </div>
                          </td>
                          <td className="px-4 py-3 min-w-[100px]"><ProgressBar value={s.progress} /></td>
                          <td className="px-4 py-3 text-sm font-black text-center"><span className={GRADE_COLORS[s.grade]}>{s.grade}</span></td>
                          <td className="px-4 py-3"><Badge label={s.status} /></td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-700">{currency(s.totalSpent)}</td>
                          <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{s.lastActive}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button onClick={() => setSelectedStudent(s)} className="p-1.5 hover:bg-violet-50 rounded-lg transition text-slate-500 hover:text-violet-600" title="View">👁</button>
                              <button onClick={() => notify(`Email sent to ${s.name}`)} className="p-1.5 hover:bg-blue-50 rounded-lg transition text-slate-500 hover:text-blue-600" title="Email">✉</button>
                              <button onClick={() => notify(`${s.name} blocked!`, 'error')} className="p-1.5 hover:bg-red-50 rounded-lg transition text-slate-500 hover:text-red-600" title="Block">🚫</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Showing {filteredStudents.length} of {STUDENTS.length} students</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition">← Prev</button>
                    <button className="px-3 py-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition">Next →</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STUDENT DETAIL ─────────────────────────────────────────────── */}
          {tab === 'students' && selectedStudent && (() => {
            const s = selectedStudent;
            return (
              <div className="space-y-5">
                <button onClick={() => setSelectedStudent(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-semibold transition">
                  ← Back to Students
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Profile Card */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex flex-col items-center text-center mb-5">
                      <Avatar initials={s.avatar} size="lg" />
                      <h2 className="font-black text-xl text-slate-900 mt-3">{s.name}</h2>
                      <p className="text-sm text-slate-500">{s.email}</p>
                      <div className="mt-2"><Badge label={s.status} /></div>
                    </div>
                    <div className="space-y-3 text-sm">
                      {[
                        ['Student ID', s.id, true],
                        ['Phone', s.phone, false],
                        ['Location', s.location, false],
                        ['Joined', s.joined, false],
                        ['Last Active', s.lastActive, false],
                        ['Total Spent', currency(s.totalSpent), false],
                        ['Completed Courses', s.completedCourses, false],
                      ].map(([k,v,mono]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-slate-500 font-medium">{k}</span>
                          <span className={`font-bold text-slate-800 ${mono?'mono text-xs':''}`}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex gap-2">
                      <button onClick={() => notify(`Email sent to ${s.name}`)} className="flex-1 py-2 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-700 transition">✉ Email</button>
                      <button onClick={() => notify(`Note saved for ${s.name}`)} className="flex-1 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition">📝 Note</button>
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="lg:col-span-2 space-y-5">
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                      <h3 className="font-black text-slate-900 mb-4">Performance Overview</h3>
                      <div className="grid grid-cols-3 gap-4 mb-5">
                        <div className="text-center p-3 bg-violet-50 rounded-xl">
                          <p className={`text-3xl font-black ${GRADE_COLORS[s.grade]}`}>{s.grade}</p>
                          <p className="text-xs text-slate-500 font-medium mt-1">Overall Grade</p>
                        </div>
                        <div className="text-center p-3 bg-indigo-50 rounded-xl">
                          <p className="text-3xl font-black text-indigo-600">{s.progress}%</p>
                          <p className="text-xs text-slate-500 font-medium mt-1">Avg Progress</p>
                        </div>
                        <div className="text-center p-3 bg-emerald-50 rounded-xl">
                          <p className="text-3xl font-black text-emerald-600">{s.completedCourses}</p>
                          <p className="text-xs text-slate-500 font-medium mt-1">Completed</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {s.courses.map(c => {
                          const course = COURSES.find(x=>x.title.startsWith(c.split(' ')[0]));
                          const prog   = course ? Math.round(s.progress * (0.8 + Math.random()*0.4)) : s.progress;
                          return (
                            <div key={c}>
                              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                                <span>{c}</span>
                                <span>{Math.min(prog, 100)}%</span>
                              </div>
                              <ProgressBar value={Math.min(prog, 100)} />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                      <h3 className="font-black text-slate-900 mb-3">Activity (Last 7 Days)</h3>
                      <BarChart data={[40,65,30,80,55,90,70]} labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']} color="from-violet-500 to-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ════ COURSES ═════════════════════════════════════════════════════ */}
          {tab === 'courses' && !selectedCourse && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {['All','Active','Draft'].map(s => (
                    <button key={s} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${s==='All'?'bg-violet-600 text-white':'bg-white border border-slate-200 text-slate-600 hover:border-violet-400'}`}>
                      {s}
                    </button>
                  ))}
                </div>
                <button onClick={() => notify('New course created!')} className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-violet-300 transition">+ New Course</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {COURSES.map(c => (
                  <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <div className="h-36 bg-gradient-to-br from-violet-500 to-indigo-600 flex flex-col items-center justify-center relative">
                      <span className="text-5xl">{c.thumbnail}</span>
                      <span className="absolute top-3 left-3 text-[10px] bg-white/20 backdrop-blur text-white font-bold px-2 py-1 rounded-full">{c.category}</span>
                      <span className="absolute top-3 right-3"><Badge label={c.status} /></span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-black text-sm text-slate-900 leading-tight">{c.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">by {c.instructor} · {c.level} · {c.duration}</p>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-xs">
                        <div><span className="text-slate-400">Students</span><p className="font-bold text-slate-800">{c.students.toLocaleString()} / {c.capacity.toLocaleString()}</p></div>
                        <div><span className="text-slate-400">Revenue</span><p className="font-bold text-emerald-600">₹{c.revenue.toLocaleString()}</p></div>
                        <div><span className="text-slate-400">Rating</span><p className="font-bold text-slate-800">⭐ {c.rating} ({c.reviews})</p></div>
                        <div><span className="text-slate-400">Price</span><p className="font-bold text-slate-800">₹{c.price}</p></div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                          <span>Enrollment ({pct(c.students, c.capacity)}%)</span>
                          <span>Completion {c.completionRate}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                          <div className="bg-violet-500 rounded-full" style={{width:`${pct(c.students,c.capacity)}%`}} />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => setSelectedCourse(c)} className="flex-1 py-2 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-700 transition">Manage</button>
                        <button onClick={() => notify('Course duplicated!')} className="px-3 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition">⧉</button>
                        <button onClick={() => notify('Course archived!', 'error')} className="px-3 py-2 border border-red-100 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 transition">🗑</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── COURSE DETAIL ──────────────────────────────────────────────── */}
          {tab === 'courses' && selectedCourse && (() => {
            const c = selectedCourse;
            return (
              <div className="space-y-5">
                <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-semibold transition">
                  ← Back to Courses
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
                    <span className="text-6xl">{c.thumbnail}</span>
                    <h2 className="font-black text-lg text-slate-900 mt-3">{c.title}</h2>
                    <p className="text-sm text-slate-500">by {c.instructor}</p>
                    <div className="mt-2"><Badge label={c.status} /></div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      {[['Category',c.category],['Level',c.level],['Duration',c.duration],['Modules',c.modules],['Price',`₹${c.price}`],['Updated',c.lastUpdated]].map(([k,v])=>(
                        <div key={k} className="bg-slate-50 rounded-xl p-2">
                          <p className="text-slate-400">{k}</p>
                          <p className="font-bold text-slate-800">{v}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => notify(`${c.title} updated!`)} className="flex-1 py-2 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-700 transition">Edit Course</button>
                      <button className="px-3 py-2 border border-slate-200 text-xs font-bold rounded-xl hover:bg-slate-50 transition">👁 Preview</button>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-5">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        {k:'Enrolled', v:c.students.toLocaleString(), color:'bg-violet-50 text-violet-700'},
                        {k:'Revenue',  v:`₹${fmt(c.revenue)}`,       color:'bg-emerald-50 text-emerald-700'},
                        {k:'Completion', v:`${c.completionRate}%`,   color:'bg-blue-50 text-blue-700'},
                      ].map(m=>(
                        <div key={m.k} className={`${m.color} rounded-xl p-4 text-center`}>
                          <p className="text-2xl font-black">{m.v}</p>
                          <p className="text-xs font-semibold opacity-70 mt-1">{m.k}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                      <h3 className="font-black text-slate-900 mb-3">Enrolled Students</h3>
                      {STUDENTS.filter(s => s.courses.some(x => c.title.toLowerCase().includes(x.toLowerCase().split(' ')[0]))).map(s => (
                        <div key={s.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                          <Avatar initials={s.avatar} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{s.name}</p>
                            <ProgressBar value={s.progress} />
                          </div>
                          <span className={`text-sm font-black ${GRADE_COLORS[s.grade]}`}>{s.grade}</span>
                          <Badge label={s.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ════ ANALYTICS ═══════════════════════════════════════════════════ */}
          {tab === 'analytics' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Avg Session Time" value="42 min"     icon="⏱" gradient="bg-violet-50"  change={8.3} />
                <StatCard title="Dropout Rate"     value="18.2%"      icon="📉" gradient="bg-red-50"    change={-3.1} />
                <StatCard title="Course Completion" value={`${avgCompletion}%`} icon="✅" gradient="bg-emerald-50" change={5.2} />
                <StatCard title="NPS Score"        value="72"         icon="💬" gradient="bg-amber-50"  change={4.7} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <h3 className="font-black text-slate-900 mb-1">Monthly Enrollments</h3>
                  <p className="text-xs text-slate-400 mb-4">Full year 2024</p>
                  <BarChart data={ENROLL_DATA} labels={MONTHS} color="from-indigo-500 to-blue-500" />
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <h3 className="font-black text-slate-900 mb-4">Course Completion Rates</h3>
                  <div className="space-y-4">
                    {COURSES.filter(c=>c.status==='Active').map(c => (
                      <div key={c.id}>
                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                          <span className="truncate mr-2">{c.title}</span>
                          <span className="flex-shrink-0">{c.completionRate}%</span>
                        </div>
                        <ProgressBar value={c.completionRate} color={c.completionRate>75?'from-emerald-500 to-teal-500':c.completionRate>50?'from-indigo-500 to-violet-500':'from-amber-500 to-orange-500'} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <h3 className="font-black text-slate-900 mb-4">Student Distribution</h3>
                  <div className="flex items-center justify-center my-2">
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      {[
                        { pct:0.55, color:'#7c3aed', label:'Active' },
                        { pct:0.25, color:'#4f46e5', label:'Completed' },
                        { pct:0.125,color:'#ef4444', label:'Inactive' },
                        { pct:0.075,color:'#f59e0b', label:'At Risk' },
                      ].reduce((acc,seg,i,arr) => {
                        const prev  = acc.offset;
                        const dash  = seg.pct * 2 * Math.PI * 55;
                        const gap   = (1 - seg.pct) * 2 * Math.PI * 55;
                        const rot   = (prev / (2*Math.PI*55)) * 360 - 90;
                        acc.els.push(
                          <circle key={i} cx="80" cy="80" r="55" fill="none" stroke={seg.color}
                            strokeWidth="22" strokeDasharray={`${dash} ${gap}`}
                            transform={`rotate(${rot} 80 80)`} strokeLinecap="round" />
                        );
                        acc.offset += dash;
                        return acc;
                      }, {offset:0, els:[]}).els}
                      <text x="80" y="84" textAnchor="middle" className="mono" fontSize="14" fontWeight="900" fill="#1e293b">100%</text>
                    </svg>
                  </div>
                  <div className="space-y-2">
                    {[['Active','55%','#7c3aed'],['Completed','25%','#4f46e5'],['Inactive','12.5%','#ef4444'],['At Risk','7.5%','#f59e0b']].map(([l,v,c])=>(
                      <div key={l} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{background:c}} /><span className="text-slate-600 font-medium">{l}</span></div>
                        <span className="font-bold text-slate-800">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <h3 className="font-black text-slate-900 mb-4">Grade Distribution</h3>
                  <div className="space-y-3">
                    {[['A+',2],['A',1],['B+',1],['B',1],['B-',1],['C',1]].map(([g,n]) => (
                      <div key={g} className="flex items-center gap-3">
                        <span className={`text-sm font-black w-6 ${GRADE_COLORS[g]||'text-slate-500'}`}>{g}</span>
                        <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${g.startsWith('A')?'from-emerald-500 to-teal-400':g.startsWith('B')?'from-blue-500 to-indigo-400':'from-amber-500 to-orange-400'}`}
                            style={{width:`${(n/STUDENTS.length)*100}%`}} />
                        </div>
                        <span className="text-xs font-bold text-slate-600 w-8 text-right">{n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════ PAYMENTS ════════════════════════════════════════════════════ */}
          {tab === 'payments' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Revenue"   value={currency(totalRevenue)}  icon="💰" gradient="bg-emerald-50" change={18.4} />
                <StatCard title="Pending Payouts" value="₹24,350"                 icon="⏳" gradient="bg-amber-50"   sub="12 instructors" />
                <StatCard title="Refund Requests" value="8"                       icon="↩" gradient="bg-red-50"     sub="₹1,192 total" />
                <StatCard title="Avg Order Value" value="₹124"                    icon="📈" gradient="bg-blue-50"    change={6.2} />
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-900 mb-4">Revenue Trend</h3>
                <BarChart data={REVENUE_DATA} labels={MONTHS} color="from-emerald-500 to-teal-500" />
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-black text-slate-900">Transaction History</h3>
                  <button onClick={() => notify('Transactions exported!')} className="px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition">↓ Export</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        {['Txn ID','Student','Course','Amount','Method','Status','Date','Action'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {TRANSACTIONS.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 mono text-xs text-slate-500">{t.id}</td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-900 whitespace-nowrap">{t.student}</td>
                          <td className="px-4 py-3 text-xs text-slate-600">{t.course}</td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-800">₹{t.amount}</td>
                          <td className="px-4 py-3 text-xs text-slate-500">{t.method}</td>
                          <td className="px-4 py-3"><Badge label={t.status} /></td>
                          <td className="px-4 py-3 text-xs text-slate-400">{t.date}</td>
                          <td className="px-4 py-3">
                            {t.status === 'Pending' && (
                              <button onClick={() => notify(`${t.id} approved!`)} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition">Approve</button>
                            )}
                            {t.status === 'Completed' && (
                              <button onClick={() => notify(`Refund initiated for ${t.id}`, 'error')} className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-lg hover:bg-orange-100 transition">Refund</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ REPORTS ═════════════════════════════════════════════════════ */}
          {tab === 'reports' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[
                  { title:'Student Performance Report', desc:'Grades, progress, and at-risk analysis', icon:'📊', color:'bg-violet-50 border-violet-100' },
                  { title:'Revenue Summary',            desc:'Monthly and yearly revenue breakdown', icon:'💰', color:'bg-emerald-50 border-emerald-100' },
                  { title:'Course Analytics',           desc:'Completion rates, ratings, and reviews', icon:'📚', color:'bg-indigo-50 border-indigo-100' },
                  { title:'Enrollment Report',          desc:'New enrollments and dropout analysis', icon:'📝', color:'bg-blue-50 border-blue-100' },
                  { title:'Instructor Report',          desc:'Instructor performance and payouts', icon:'👩‍🏫', color:'bg-pink-50 border-pink-100' },
                  { title:'Refund & Dispute Report',    desc:'Refund requests and resolution stats', icon:'↩', color:'bg-red-50 border-red-100' },
                ].map(r => (
                  <div key={r.title} className={`${r.color} border rounded-2xl p-5`}>
                    <span className="text-3xl">{r.icon}</span>
                    <h3 className="font-black text-slate-900 text-sm mt-3 mb-1">{r.title}</h3>
                    <p className="text-xs text-slate-500 mb-4">{r.desc}</p>
                    <div className="flex gap-2">
                      <button onClick={() => notify(`${r.title} generated!`)} className="flex-1 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition">Generate</button>
                      <button onClick={() => notify(`${r.title} scheduled!`)} className="px-3 py-2 border border-slate-200 bg-white text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition">Schedule</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ SETTINGS ════════════════════════════════════════════════════ */}
          {tab === 'settings' && (
            <div className="max-w-2xl space-y-5">
              {[
                { title:'Platform Information', fields:[
                  { label:'Platform Name', type:'text', value:'AcademAI' },
                  { label:'Support Email', type:'email', value:'support@academai.com' },
                  { label:'Contact Phone', type:'tel', value:'+91 1800-LEARN' },
                ]},
                { title:'Enrollment Settings', fields:[
                  { label:'Default Course Price (₹)', type:'number', value:'999' },
                  { label:'Max Students per Course', type:'number', value:'2000' },
                ]},
              ].map(section => (
                <div key={section.title} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <h3 className="font-black text-slate-900 mb-4">{section.title}</h3>
                  <div className="space-y-4">
                    {section.fields.map(f => (
                      <div key={f.label}>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">{f.label}</label>
                        <input type={f.type} defaultValue={f.value}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-900 mb-4">Toggle Features</h3>
                <div className="space-y-3">
                  {[
                    ['Maintenance Mode', 'Disable public access temporarily', false],
                    ['Student Registrations', 'Allow new student sign-ups', true],
                    ['Email Notifications', 'Send automated email alerts', true],
                    ['Certificate Generation', 'Auto-generate on completion', true],
                  ].map(([label, desc, def]) => (
                    <div key={label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={def} className="sr-only peer" />
                        <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-violet-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => notify('Settings saved successfully!')} className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-violet-300 hover:-translate-y-0.5 transition-all">
                Save All Settings
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}