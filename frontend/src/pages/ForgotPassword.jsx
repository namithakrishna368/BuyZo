import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Logo from '../components/Logo';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      });
      toast.success(data.message);

      if (data.requiresOtp && data.email) {
        const params = new URLSearchParams({ email: data.email });
        if (data.devOtp) params.set('devOtp', data.devOtp);
        navigate(`/reset-password-otp?${params.toString()}`, { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="mb-6 text-center">
          <Logo className="justify-center" />
          <h1 className="mt-4 font-display text-2xl font-bold text-navy-800">Forgot password</h1>
          <p className="mt-1 text-sm text-navy-500">We&apos;ll send a 6-digit code to your email</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input
                id="email"
                type="email"
                required
                className="input-field pl-11"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
          <p className="text-center text-sm text-navy-500">
            <Link to="/login" className="font-semibold text-navy-600 hover:underline">
              Back to Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
