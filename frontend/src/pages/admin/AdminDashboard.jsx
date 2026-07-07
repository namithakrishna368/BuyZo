import { useEffect, useState } from 'react';
import { FiUsers, FiUserCheck, FiUserX, FiMail, FiGrid, FiShoppingCart, FiDollarSign } from 'react-icons/fi';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const statCards = [
  { key: 'totalRevenue', label: 'Total Revenue (₹)', icon: FiUsers, color: 'bg-green-100 text-green-600' },
  { key: 'totalOrders', label: 'Total Orders', icon: FiUserCheck, color: 'bg-blue-100 text-blue-600' },
  { key: 'totalProducts', label: 'Active Products', icon: FiGrid, color: 'bg-yellow-100 text-yellow-600' },
  { key: 'activeUsers', label: 'Active Users', icon: FiUserCheck, color: 'bg-navy-100 text-navy-600' },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data.stats);
      } catch {
        /* handled by interceptor */
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-800">Dashboard Overview</h1>
      <p className="mt-1 text-navy-500">Monitor your platform at a glance</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="card flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-800">{stats?.[key] ?? 0}</p>
              <p className="text-sm text-navy-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
