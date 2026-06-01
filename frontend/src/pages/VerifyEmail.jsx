import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import api from '../api/axios';
import Logo from '../components/Logo';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    const verify = async () => {
      try {
        const { data } = await api.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed.');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="auth-container">
      <div className="auth-card text-center">
        <Logo className="mb-6 justify-center" />
        {status === 'loading' && (
          <>
            <FiLoader className="mx-auto h-12 w-12 animate-spin text-navy-600" />
            <p className="mt-4 text-navy-600">Verifying your email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <FiCheckCircle className="mx-auto h-16 w-16 text-green-600" />
            <h2 className="mt-4 font-display text-2xl font-bold text-navy-800">Email Verified!</h2>
            <p className="mt-2 text-navy-500">{message}</p>
            <Link to="/login" className="btn-primary mt-8 inline-flex w-full justify-center">
              Sign In Now
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <FiXCircle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-4 font-display text-2xl font-bold text-navy-800">Verification Failed</h2>
            <p className="mt-2 text-navy-500">{message}</p>
            <Link to="/register" className="btn-secondary mt-8 inline-flex w-full justify-center">
              Back to Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
