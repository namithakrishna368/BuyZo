import { NavLink } from 'react-router-dom';
import { FiUsers, FiGrid, FiShield, FiShoppingCart } from 'react-icons/fi';
import Logo from './Logo';

const links = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard', end: true },
  { to: '/admin/orders', icon: FiShoppingCart, label: 'Orders' },
  { to: '/admin/products', icon: FiGrid, label: 'Products' },
  { to: '/admin/categories', icon: FiGrid, label: 'Categories' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
];

const AdminSidebar = () => (
  <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-amazon-nav bg-amazon-nav">
    <div className="border-b border-gray-700 p-6">
      <Logo className="text-white [&_span]:text-white [&_span:last-child]:text-amazon-gold" />
      <div className="mt-3 flex items-center gap-2 text-gray-300">
        <FiShield className="h-4 w-4 text-amazon-gold" />
        <span className="text-xs font-medium uppercase tracking-wider">Seller Central</span>
      </div>
    </div>
    <nav className="flex-1 space-y-1 p-4">
      {links.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-gray-800 text-white border-l-4 border-amazon-gold'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
    <div className="border-t border-gray-700 p-4">
      <p className="text-center text-xs text-gray-400">Amazon Admin v1.0</p>
    </div>
  </aside>
);

export default AdminSidebar;
