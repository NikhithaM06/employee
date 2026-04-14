import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', to: '/dashboard' },
  { name: 'Employees', to: '/employees' },
  { name: 'Manage Employees', to: '/manage-employees' },
  { name: 'Past Employees', to: '/past-employees' },
  { name: 'Clients', to: '/clients' },
  { name: 'Services', to: '/services' },
];

export default function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <aside className="w-full md:w-72 flex-shrink-0 bg-slate-950 text-slate-100 md:min-h-screen">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-5 py-8 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 text-xl font-semibold text-slate-950">
            EMS
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Employee</p>
            <h1 className="text-xl font-semibold">Management</h1>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center rounded-3xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-100 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <p className="text-sm text-slate-400 mb-2">Logged in as: {user?.email}</p>
          <button
            onClick={logout}
            className="w-full flex items-center rounded-3xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}