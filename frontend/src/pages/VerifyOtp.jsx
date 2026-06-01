import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Logo from '../components/Logo';
import OtpInput from '../components/OtpInput';

const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState(searchParams.get('devOtp') || '');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Enter the 6-digit code');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      toast.success(data.message);
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      const { data } = await api.post('/auth/resend-otp', { email, purpose: 'verify' });
      toast.success(data.message);
      if (data.devOtp) setDevOtp(data.devOtp);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend');
    }
  };

  if (!email) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center">
          <p className="text-navy-600">Missing email. Please register again.</p>
          <Link to="/register" className="btn-primary mt-4 inline-flex">
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card text-center">
        <Logo className="mb-4 justify-center" />
        <h1 className="font-display text-2xl font-bold text-navy-800">Verify your email</h1>
        <p className="mt-2 text-sm text-navy-500">
          Enter the 6-digit code sent to <strong className="text-navy-700">{email}</strong>
        </p>

        {devOtp && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Dev OTP: <strong>{devOtp}</strong>
          </div>
        )}

        <form onSubmit={handleVerify} className="mt-8 space-y-6">
          <OtpInput value={otp} onChange={setOtp} />
          <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full">
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <button type="button" onClick={resend} className="mt-4 text-sm font-medium text-navy-600 hover:underline">
          Resend code
        </button>
        <p className="mt-6 text-sm text-navy-500">
          <Link to="/login" className="font-semibold text-navy-600 hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
