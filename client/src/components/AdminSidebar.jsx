import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-indigo-700 text-white p-6 space-y-6">
      <h2 className="text-2xl font-bold">Admin Panel</h2>

      <nav className="flex flex-col space-y-4">
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/users">Manage Users</Link>
        <Link to="/admin/courses">Manage Courses</Link>
        <Link to="/admin/analytics">Analytics</Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
