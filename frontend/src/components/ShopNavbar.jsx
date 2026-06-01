import { Link } from 'react-router-dom';
import { FiShoppingBag, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const ShopNavbar = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-cream-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link to="/products" className="btn-ghost flex items-center gap-1.5">
            <FiShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Shop</span>
          </Link>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-ghost flex items-center gap-1.5">
              <FiUser className="h-4 w-4" />
              <span className="hidden sm:inline">{user?.name?.split(' ')[0] || 'Account'}</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost hidden sm:inline-flex">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Join
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default ShopNavbar;
