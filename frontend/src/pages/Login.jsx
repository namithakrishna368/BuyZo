import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import GoogleAuthButton from '../components/GoogleAuthButton';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const err = searchParams.get('error');
    if (err === 'google_auth_failed') {
      setError('Google sign-in failed. Please try again or use email and password.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNeedsVerification(false);

    const payload = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };

    try {
      const { data } = await api.post('/auth/login', payload);
      login(data.user, data.token);
      toast.success('Welcome back!');
      navigate(data.user.profileComplete ? '/' : '/profile/setup', { replace: true });
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.message || (err.code === 'ERR_NETWORK' ? 'Cannot reach server. Is the backend running on port 5000?' : 'Login failed');

      setError(msg);
      setNeedsVerification(Boolean(data?.requiresVerification));
      if (data?.requiresOtp) {
        const params = new URLSearchParams({ email: payload.email });
        navigate(`/verify-otp?${params.toString()}`);
        return;
      }
      if (data?.wrongPassword) {
        setError('Incorrect password. Click "Forgot password?" below to set a new one.');
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    const email = form.email.trim().toLowerCase();
    if (!email) {
      toast.error('Enter your email address first');
      return;
    }
    try {
      const { data } = await api.post('/auth/resend-otp', { email, purpose: 'verify' });
      toast.success(data.message);
      if (data.devOtp) {
        navigate(`/verify-otp?email=${encodeURIComponent(email)}&devOtp=${data.devOtp}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="mb-6 text-center">
          <Logo className="justify-center" />
          <h1 className="mt-4 font-display text-2xl font-bold text-navy-800">Welcome back</h1>
          <p className="mt-1 text-sm text-navy-500">Sign in to your BuyZO account</p>
        </div>

        <GoogleAuthButton label="Sign in with Google" dividerText="or sign in with email" />

        {error && (
          <div
            className="mb-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            role="alert"
          >
            <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p>{error}</p>
              {needsVerification && (
                <button
                  type="button"
                  onClick={resendVerification}
                  className="mt-2 font-semibold text-navy-700 underline hover:text-navy-900"
                >
                  Resend verification email
                </button>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field pl-11"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-field pl-11"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Link to="/forgot-password" className="text-sm font-medium text-navy-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-navy-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-navy-600 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
