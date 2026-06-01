import { useEffect, useState, useCallback } from 'react';
import { FiSearch, FiUserX, FiUserCheck, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [togglingId, setTogglingId] = useState(null);

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', {
        params: { search, status, page, limit: 10 },
      });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(1), 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const toggleBlock = async (userId) => {
    setTogglingId(userId);
    try {
      const { data } = await api.patch(`/admin/users/${userId}/toggle-block`);
      toast.success(data.message);
      setUsers((prev) => prev.map((u) => (u._id === userId ? data.user : u)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-800">User Management</h1>
          <p className="mt-1 text-navy-500">{pagination.total} users registered</p>
        </div>
        <button onClick={() => fetchUsers(pagination.page)} className="btn-ghost self-start">
          <FiRefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="input-field pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field w-full sm:w-48"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-card">
        {loading ? (
          <LoadingSpinner />
        ) : users.length === 0 ? (
          <p className="py-12 text-center text-navy-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-cream-200 bg-cream-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-navy-700">User</th>
                  <th className="px-6 py-4 font-semibold text-navy-700">Email</th>
                  <th className="px-6 py-4 font-semibold text-navy-700">Verified</th>
                  <th className="px-6 py-4 font-semibold text-navy-700">Status</th>
                  <th className="px-6 py-4 font-semibold text-navy-700">Joined</th>
                  <th className="px-6 py-4 font-semibold text-navy-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-cream-50/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-navy-800">{user.name || '—'}</p>
                    </td>
                    <td className="px-6 py-4 text-navy-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {user.isEmailVerified ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-navy-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleBlock(user._id)}
                        disabled={togglingId === user._id}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          user.isBlocked
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        } disabled:opacity-50`}
                      >
                        {user.isBlocked ? (
                          <>
                            <FiUserCheck className="h-3.5 w-3.5" />
                            Unblock
                          </>
                        ) : (
                          <>
                            <FiUserX className="h-3.5 w-3.5" />
                            Block
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-cream-200 px-6 py-4">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchUsers(pagination.page - 1)}
              className="btn-ghost disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-navy-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchUsers(pagination.page + 1)}
              className="btn-ghost disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
