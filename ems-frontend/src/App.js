import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SidebarNew from './components/SidebarNew';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import ManageEmployees from './pages/ManageEmployees';
import PastEmployees from './pages/PastEmployees';
import EmployeeDetail from './pages/EmployeeDetail';
import AddEmployee from './pages/AddEmployee';
import Clients from './pages/Clients';
import Services from './pages/Services';
import Login from './pages/Login';
import EmployeeHome from './pages/EmployeeHome';
import Spinner from './components/Spinner';

function AuthRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return !user ? children : <Navigate to={user.role === 'admin' ? "/dashboard" : "/home"} replace />;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Router>
        <ToastContainer position="top-right" theme="colored" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
        {user ? (
          <div className="flex min-h-screen">
            {/* Hover Expand Sidebar */}
            <SidebarNew />
            
            {/* Main Content Area */}
            <div className="ml-20 flex-1 flex flex-col">
              {/* Header */}
              <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-slate-950">EMS - Employee Management System</span>
                <div></div> {/* Spacer */}
              </header>
              
              {/* Main Routes */}
              <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                <Routes>
                  {user.role === 'admin' ? (
                    <>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/employees" element={<Employees />} />
                      <Route path="/employees/new" element={<AddEmployee />} />
                      <Route path="/employees/:id" element={<EmployeeDetail />} />
                      <Route path="/manage-employees" element={<ManageEmployees />} />
                      <Route path="/past-employees" element={<PastEmployees />} />
                      <Route path="/clients" element={<Clients />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </>
                  ) : (
                    <>
                      <Route path="/home" element={<EmployeeHome />} />
                      <Route path="/" element={<Navigate to="/home" replace />} />
                      <Route path="*" element={<Navigate to="/home" replace />} />
                    </>
                  )}
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

