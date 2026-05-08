import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', to: '/dashboard', icon: '' },
  { name: 'Employees', to: '/employees', icon: '👥' },
  { name: 'Manage Employees', to: '/manage-employees', icon: '⚙️' },
  { name: 'Past Employees', to: '/past-employees', icon: '📁' },
  { name: 'Clients', to: '/clients', icon: '🏢' },
  { name: 'Services', to: '/services', icon: '🔧' },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed left-0 top-0 h-full bg-slate-950 text-slate-100 transition-all duration-300 ease-in-out z-40 ${
        isExpanded ? 'w-72' : 'w-20'
      }`}
    >
      <div className="flex flex-col gap-6 px-4 py-8 h-full">
        {/* Logo Section */}
        <div className="flex items-center gap-3 justify-start">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-xl font-semibold text-slate-950">
            EMS
          </div>
          {isExpanded && (
            <div className="overflow-hidden">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400 whitespace-nowrap">Employee</p>
              <h1 className="text-lg font-semibold whitespace-nowrap">Management</h1>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {(user?.role === 'admin' ? navItems : [{ name: 'Home', to: '/home', icon: '🏠' }]).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={!isExpanded ? item.name : ''}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                } ${isExpanded ? 'justify-start' : 'justify-center'}`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {isExpanded && <span className="whitespace-nowrap">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="space-y-3 border-t border-slate-700 pt-4">
          {isExpanded && user && (
            <p className="text-xs text-slate-400 truncate px-2">Logged in as: {user.email}</p>
          )}
          <button
            onClick={handleLogout}
            title={!isExpanded ? 'Logout' : ''}
            className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-900 hover:text-white transition-all duration-200 ${
              isExpanded ? 'justify-start' : 'justify-center'
            }`}
          >
            <span className="text-lg">🚪</span>
            {isExpanded && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}