import { Link } from 'react-router-dom';
import ShopLayout from '../layouts/ShopLayout';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { isAuthenticated } = useAuth();

  return (
    <ShopLayout>
      <div className="mx-auto max-w-[1500px] px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
        {isAuthenticated ? (
          <div className="mt-8 rounded bg-white p-12 text-center shadow-sm">
            <p className="text-gray-600">You haven&apos;t placed any orders yet.</p>
            <Link to="/products" className="mt-4 inline-block text-amazon-link hover:underline">
              Start shopping →
            </Link>
          </div>
        ) : (
          <div className="mt-8 rounded bg-white p-12 text-center shadow-sm">
            <p className="text-gray-600">Sign in to view your orders.</p>
            <Link to="/login" className="mt-4 inline-block text-amazon-link hover:underline">
              Sign in →
            </Link>
          </div>
        )}
      </div>
    </ShopLayout>
  );
};

export default Orders;
