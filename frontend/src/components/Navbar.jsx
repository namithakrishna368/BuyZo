import { Link } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = ({ variant = 'user' }) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-cream-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="flex items-center gap-4">
          {variant === 'admin' ? (
            <span className="rounded-full bg-navy-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy-600">
              Admin Panel
            </span>
          ) : (
            <>
              <Link to="/products" className="btn-ghost hidden sm:inline-flex">
                Shop
              </Link>
              <Link to="/dashboard" className="btn-ghost hidden sm:inline-flex">
                Dashboard
              </Link>
            </>
          )}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-navy-800">{user?.name}</p>
              <p className="text-xs text-navy-400">{user?.email}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-100 text-navy-600">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <FiUser className="h-5 w-5" />
              )}
            </div>
            {!isAdmin && (
              <Link to="/profile/setup" className="btn-ghost hidden md:inline-flex">
                Profile
              </Link>
            )}
            <button onClick={logout} className="btn-ghost text-red-600 hover:bg-red-50" title="Logout">
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
