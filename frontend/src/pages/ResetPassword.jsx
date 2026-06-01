import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Logo from '../components/Logo';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { token, password });
      toast.success(data.message);
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center">
          <Logo className="mb-4 justify-center" />
          <p className="text-navy-600">Invalid or missing reset link.</p>
          <Link to="/forgot-password" className="btn-primary mt-6 inline-flex w-full justify-center">
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="mb-6 text-center">
          <Logo className="justify-center" />
          <h1 className="mt-4 font-display text-2xl font-bold text-navy-800">Set new password</h1>
          <p className="mt-1 text-sm text-navy-500">Choose a new password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="password">
              New Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input
                id="password"
                type="password"
                required
                minLength={6}
                className="input-field pl-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="confirm">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input
                id="confirm"
                type="password"
                required
                minLength={6}
                className="input-field pl-11"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Saving...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
