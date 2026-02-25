import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api/api';
import { useUser } from '../../contexts/UserContext';

const ManageUsers = () => {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await adminAPI.getAllUsers();
        const data = res?.data?.data || res?.data || [];
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter(u => u._id !== id && u.id !== id));
    } catch (err) {
      console.error(err);
      window.alert('Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-sm text-gray-500">Manage platform users (admins only)</p>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3">Username</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id || u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{u.username || u.name || '—'}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">{u.role}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleDelete(u._id || u.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
