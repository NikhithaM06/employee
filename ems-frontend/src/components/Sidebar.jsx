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

export default function Sidebar({ isOpen, onClose }) {
  const { logout, user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`w-full md:w-72 flex-shrink-0 bg-white text-slate-900 border-r border-slate-200 md:min-h-screen fixed md:static top-0 left-0 h-full z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300`}>
        <div className="mx-auto flex max-w-md flex-col gap-6 px-5 py-8 md:px-6 h-full">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 text-xl font-semibold text-white shadow-sm">
              EMS
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Employee</p>
              <h1 className="text-xl font-semibold">Management</h1>
            </div>
          </div>

          <nav className="space-y-1 flex-1 mt-4">
            {(user?.role === 'admin' ? navItems : [{ name: 'Home', to: '/home' }]).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-slate-100 text-slate-950 shadow-sm font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-500 mb-3 truncate">Logged in as: {user?.email}</p>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full rounded-3xl px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 bg-red-600 shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
