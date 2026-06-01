import { Link } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-cream-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-navy-800">
            Welcome back, {user?.name?.split(' ')[0] || 'Shopper'}!
          </h1>
          <p className="mt-1 text-navy-500">Your BuyZO dashboard is ready. More features coming soon.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-100">
              <FiUser className="h-6 w-6 text-navy-600" />
            </div>
            <h3 className="font-semibold text-navy-800">Profile</h3>
            <p className="mt-1 text-sm text-navy-500">
              {user?.profileComplete ? 'Your profile is complete' : 'Complete your profile for checkout'}
            </p>
            <Link to="/profile/setup" className="mt-4 inline-block text-sm font-semibold text-navy-600 hover:underline">
              {user?.profileComplete ? 'Edit Profile' : 'Complete Profile'} →
            </Link>
          </div>

          <div className="card">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-100">
              <FiShoppingBag className="h-6 w-6 text-navy-600" />
            </div>
            <h3 className="font-semibold text-navy-800">Shop Products</h3>
            <p className="mt-1 text-sm text-navy-500">Browse our catalog and find your favorites</p>
            <Link to="/products" className="mt-4 inline-block text-sm font-semibold text-navy-600 hover:underline">
              View Products →
            </Link>
          </div>

          <div className="card">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-navy-800">Account Status</h3>
            <ul className="mt-2 space-y-1 text-sm text-navy-500">
              <li>Email: {user?.isEmailVerified ? '✓ Verified' : 'Pending verification'}</li>
              <li>Role: {user?.role}</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
