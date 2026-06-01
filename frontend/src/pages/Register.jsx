import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Logo from '../components/Logo';
import GoogleAuthButton from '../components/GoogleAuthButton';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({ message: '', devVerifyUrl: '', skipVerification: false });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      toast.success(data.message);

      if (data.requiresOtp && data.email) {
        const params = new URLSearchParams({ email: data.email });
        if (data.devOtp) params.set('devOtp', data.devOtp);
        navigate(`/verify-otp?${params.toString()}`, { replace: true });
        return;
      }

      setRegisterInfo({
        message: data.message,
        devVerifyUrl: data.devVerifyUrl || '',
        skipVerification: !data.requiresVerification,
      });
      setRegistered(true);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network')) {
        toast.error('Cannot reach server. Make sure the backend is running on port 5000.');
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-100">
            <FiMail className="h-8 w-8 text-navy-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-navy-800">
            {registerInfo.skipVerification ? 'Account created!' : 'Check your email'}
          </h2>
          <p className="mt-3 text-navy-500">{registerInfo.message}</p>
          {!registerInfo.skipVerification && (
            <p className="mt-2 text-sm text-navy-500">
              Sent to <strong className="text-navy-700">{form.email}</strong>
            </p>
          )}
          {registerInfo.devVerifyUrl && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-left text-xs text-amber-900">
              <p className="font-semibold">Dev verification link:</p>
              <a href={registerInfo.devVerifyUrl} className="mt-1 block break-all underline">
                {registerInfo.devVerifyUrl}
              </a>
            </div>
          )}
          <Link to="/login" className="btn-primary mt-8 inline-flex w-full justify-center">
            Go to Login
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
          <h1 className="mt-4 font-display text-2xl font-bold text-navy-800">Create your account</h1>
          <p className="mt-1 text-sm text-navy-500">Join BuyZO and start shopping today</p>
        </div>

        <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-navy-400">
          Sign up with
        </p>
        <GoogleAuthButton label="Sign up with Google" dividerText="or register with email" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-field pl-11"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>
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
                required
                className="input-field pl-11"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
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
                required
                minLength={6}
                className="input-field pl-11"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="input-field pl-11"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-navy-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-navy-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
