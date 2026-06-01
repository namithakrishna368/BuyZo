import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const GoogleAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const redirect = searchParams.get('redirect') || '/';

    if (!token) {
      navigate('/login?error=google_auth_failed');
      return;
    }

    localStorage.setItem('token', token);

    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        login(data.user, token);
        navigate(redirect, { replace: true });
      } catch {
        navigate('/login?error=google_auth_failed');
      }
    };

    fetchUser();
  }, [searchParams, navigate, login]);

  return <LoadingSpinner fullScreen />;
};

export default GoogleAuthSuccess;
