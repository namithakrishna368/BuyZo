import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Logo from '../components/Logo';
import OtpInput from '../components/OtpInput';

const ResetPasswordOtp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState(searchParams.get('devOtp') || '');

  const resend = async () => {
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success(data.message);
      if (data.devOtp) setDevOtp(data.devOtp);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Enter the 6-digit code');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password-otp', { email, otp, password });
      toast.success(data.message);
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center">
          <Link to="/forgot-password" className="btn-primary inline-flex">
            Request reset code
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
          <h1 className="mt-4 font-display text-2xl font-bold text-navy-800">Reset password</h1>
          <p className="mt-1 text-sm text-navy-500">
            Code sent to <strong>{email}</strong>
          </p>
        </div>

        {devOtp && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-center text-sm text-amber-900">
            Dev OTP: <strong>{devOtp}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label mb-3 block text-center">Enter 6-digit code</label>
            <OtpInput value={otp} onChange={setOtp} />
          </div>
          <div>
            <label className="label" htmlFor="password">
              New password
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
              Confirm password
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
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <button type="button" onClick={resend} className="mt-4 w-full text-center text-sm font-medium text-navy-600 hover:underline">
          Resend code
        </button>
        <p className="mt-4 text-center text-sm text-navy-500">
          <Link to="/login" className="font-semibold text-navy-600 hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordOtp;
