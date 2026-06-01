import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export const ProtectedRoute = ({ children, skipProfileCheck = false }) => {
  const { user, loading, isAdmin, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (!skipProfileCheck && !user.profileComplete && location.pathname !== '/profile/setup') {
    return <Navigate to="/profile/setup" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullScreen />;

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const GuestRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  if (user) {
    const destination = isAdmin
      ? '/admin'
      : user.profileComplete
        ? '/'
        : '/profile/setup';
    return <Navigate to={destination} replace />;
  }

  return children;
};
