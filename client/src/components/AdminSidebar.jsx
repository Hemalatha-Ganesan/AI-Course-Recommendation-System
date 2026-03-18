import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/courses', label: 'Courses', icon: '📚' },
    { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 shadow-lg flex flex-col min-h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-lg">A</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">AcademAI Admin</h2>
            <p className="text-xs text-slate-500 font-medium">Control Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group ${
              location.pathname === item.path
                ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg shadow-slate-400/20'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
            <span className={`ml-auto w-2 h-2 rounded-full bg-green-400 ${location.pathname === item.path ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity`} />
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer group transition-colors" onClick={handleLogout}>
          <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-500 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:bg-red-500 transition-colors">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 group-hover:text-red-600 truncate">Admin User</p>
            <p className="text-xs text-slate-500">Sign out</p>
          </div>
          <span className="text-slate-400 group-hover:text-red-500 text-xl">↗</span>
        </div>
        <div className="text-xs text-slate-400 mt-3 text-center">
          v1.0.0 · © 2024 AcademAI
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
