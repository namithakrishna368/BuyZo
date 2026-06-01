import { NavLink } from 'react-router-dom';
import { FiUsers, FiGrid, FiShield } from 'react-icons/fi';
import Logo from './Logo';

const links = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: FiUsers, label: 'User Management' },
];

const AdminSidebar = () => (
  <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-navy-700 bg-navy-800">
    <div className="border-b border-navy-700 p-6">
      <Logo className="text-cream-100 [&_span]:text-cream-100 [&_span:last-child]:text-cream-300" />
      <div className="mt-3 flex items-center gap-2 text-cream-300">
        <FiShield className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wider">Administration</span>
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
                ? 'bg-navy-600 text-cream-100'
                : 'text-cream-300 hover:bg-navy-700 hover:text-cream-100'
            }`
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
    <div className="border-t border-navy-700 p-4">
      <p className="text-center text-xs text-navy-400">BuyZO Admin v1.0</p>
    </div>
  </aside>
);

export default AdminSidebar;
