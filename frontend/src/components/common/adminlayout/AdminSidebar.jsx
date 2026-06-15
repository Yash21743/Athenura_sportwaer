import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdInventory,
  MdCategory,
  MdLeaderboard,
  MdShoppingCart,
  MdStar,
  MdLogout,
} from 'react-icons/md';

const navItems = [
  { label: 'Dashboard',    icon: <MdDashboard />,    path: '/admin/dashboard' },
  { label: 'Products',     icon: <MdInventory />,    path: '/admin/products' },
  { label: 'Categories',   icon: <MdCategory />,     path: '/admin/categories' },
  { label: 'Leads',        icon: <MdLeaderboard />,  path: '/admin/leads' },
  { label: 'Bulk Orders',  icon: <MdShoppingCart />, path: '/admin/bulk-orders' },
  { label: 'Testimonials', icon: <MdStar />,         path: '/admin/testimonials' },
];

const AdminSidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-[#0A2540] text-white flex flex-col">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-wide">
          <span className="text-[#FF3B30]">Comfy</span> Admin
        </h1>
        <p className="text-xs text-white/40 mt-1">Sport Wear Panel</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-[#FF3B30] text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 py-5 border-t border-white/10">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-white/70 hover:bg-red-600 hover:text-white transition-all duration-200">
          <MdLogout className="text-lg" />
          Logout
        </button>
      </div>

    </aside>
  );
};

export default AdminSidebar;
