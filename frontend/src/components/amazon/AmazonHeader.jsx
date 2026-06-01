import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiShoppingCart, FiMenu, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const categories = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Sports',
  'Beauty',
  'Books',
  'Toys',
];

const AmazonHeader = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (searchCategory !== 'All') params.set('category', searchCategory);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <header className="amazon-header text-white">
      <div className="bg-amazon-nav">
        <div className="mx-auto flex max-w-[1500px] items-center gap-2 px-3 py-2 sm:gap-4 sm:px-4">
          <Link to="/" className="flex shrink-0 items-center rounded border border-transparent px-1 py-1 hover:border-white">
            <span className="font-display text-xl font-bold tracking-tight sm:text-2xl">
              Buy<span className="text-amazon-gold">ZO</span>
            </span>
          </Link>

          <Link
            to="/products"
            className="hidden items-center gap-1 rounded border border-transparent px-2 py-1 text-sm hover:border-white lg:flex"
          >
            <FiMapPin className="h-4 w-4" />
            <div className="text-left leading-tight">
              <span className="block text-[11px] text-gray-300">Deliver to</span>
              <span className="font-bold">India 🇮🇳</span>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="flex flex-1 items-stretch">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="hidden rounded-l-md bg-gray-200 px-2 text-xs text-gray-800 sm:block sm:text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands and more"
              className="w-full px-3 py-2 text-sm text-gray-900 sm:text-base"
            />
            <button
              type="submit"
              className="rounded-r-md bg-amazon-gold px-3 text-gray-900 hover:bg-amazon-gold-hover sm:px-5"
            >
              <FiSearch className="h-5 w-5" />
            </button>
          </form>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="hidden rounded border border-transparent px-2 py-1 hover:border-white sm:block"
              >
                <span className="block text-[11px]">Hello, {user?.name?.split(' ')[0]}</span>
                <span className="flex items-center gap-0.5 text-sm font-bold">
                  Account & Lists <FiChevronDown className="h-3 w-3" />
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden rounded border border-transparent px-2 py-1 hover:border-white sm:block"
              >
                <span className="block text-[11px]">Hello, sign in</span>
                <span className="flex items-center gap-0.5 text-sm font-bold">
                  Account & Lists <FiChevronDown className="h-3 w-3" />
                </span>
              </Link>
            )}

            <Link
              to="/orders"
              className="hidden rounded border border-transparent px-2 py-1 hover:border-white md:block"
            >
              <span className="block text-[11px]">Returns</span>
              <span className="text-sm font-bold">& Orders</span>
            </Link>

            <Link
              to="/cart"
              className="relative flex items-end gap-1 rounded border border-transparent px-2 py-1 hover:border-white"
            >
              <div className="relative">
                <FiShoppingCart className="h-8 w-8" />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amazon-gold px-1 text-xs font-bold text-gray-900">
                  {cartCount}
                </span>
              </div>
              <span className="hidden pb-1 text-sm font-bold sm:inline">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-amazon-nav-secondary">
        <div className="mx-auto flex max-w-[1500px] items-center gap-3 overflow-x-auto px-3 py-1.5 text-sm sm:px-4">
          <Link to="/products" className="flex shrink-0 items-center gap-1 rounded px-2 py-1 hover:outline hover:outline-1 hover:outline-white">
            <FiMenu className="h-4 w-4" />
            <span className="font-bold">All</span>
          </Link>
          {categories.slice(1).map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="shrink-0 rounded px-2 py-1 hover:outline hover:outline-1 hover:outline-white"
            >
              {cat}
            </Link>
          ))}
          <Link to="/products?featured=true" className="shrink-0 rounded px-2 py-1 font-semibold text-amazon-gold hover:outline hover:outline-1 hover:outline-white">
            Today&apos;s Deals
          </Link>
          <Link to="/products?prime=true" className="shrink-0 rounded px-2 py-1 hover:outline hover:outline-1 hover:outline-white">
            BuyZO Prime
          </Link>
          <span className="shrink-0 rounded px-2 py-1 text-xs text-gray-300">UPI · COD available</span>
        </div>
      </div>
    </header>
  );
};

export default AmazonHeader;
