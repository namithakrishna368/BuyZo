import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      if (data.user.role !== 'admin') {
        toast.error('Access denied. Admin credentials required.');
        return;
      }
      login(data.user, data.token);
      toast.success('Welcome, Admin!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-800 px-4">
      <div className="w-full max-w-md rounded-2xl border border-navy-700 bg-navy-900 p-8 shadow-elevated">
        <div className="mb-8 text-center">
          <Logo className="justify-center text-cream-100 [&_span]:text-cream-100 [&_span:last-child]:text-cream-300" />
          <div className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-full bg-navy-700">
            <FiShield className="h-7 w-7 text-cream-100" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-cream-100">Admin Portal</h1>
          <p className="mt-1 text-sm text-cream-300">Sign in to manage BuyZO</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cream-200" htmlFor="email">
              Admin Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-400" />
              <input
                id="email"
                type="email"
                required
                className="w-full rounded-lg border border-navy-600 bg-navy-800 py-3 pl-11 pr-4 text-cream-100 placeholder:text-navy-400 focus:border-cream-300 focus:outline-none focus:ring-2 focus:ring-cream-300/20"
                placeholder="admin@buyzo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cream-200" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-400" />
              <input
                id="password"
                type="password"
                required
                className="w-full rounded-lg border border-navy-600 bg-navy-800 py-3 pl-11 pr-4 text-cream-100 placeholder:text-navy-400 focus:border-cream-300 focus:outline-none focus:ring-2 focus:ring-cream-300/20"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cream-100 py-3 text-sm font-semibold text-navy-800 transition hover:bg-white disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
