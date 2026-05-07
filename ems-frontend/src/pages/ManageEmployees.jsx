import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiFetch from '../utils/api';

const domainFilters = [
  { label: 'All', value: 'All' },
  { label: 'Dev', value: 'Developer' },
  { label: 'QA', value: 'QA' },
  { label: 'HR', value: 'HR' },
  { label: 'Finance', value: 'Finance' }
];

export default function ManageEmployees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  
  const [credentialModalOpen, setCredentialModalOpen] = useState(false);
  const [selectedEmployeeForCredential, setSelectedEmployeeForCredential] = useState(null);
  const [credentialEmail, setCredentialEmail] = useState('');
  const [credentialPassword, setCredentialPassword] = useState('');
  const [credentialLoading, setCredentialLoading] = useState(false);
  const [showCredentialPassword, setShowCredentialPassword] = useState(false);

  useEffect(() => {
    async function loadActiveEmployees() {
      setLoading(true);
      setError('');
      try {
        const response = await apiFetch('/api/employees?status=active');
        if (!response.ok) {
          throw new Error('Unable to load active employees');
        }
        setEmployees(await response.json());
      } catch (fetchError) {
        setError(fetchError.message || 'Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    }

    loadActiveEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees
      .filter((employee) =>
        employee.name.toLowerCase().includes(search.toLowerCase()) ||
        employee.previousCompany?.toLowerCase().includes(search.toLowerCase())
      )
      .filter((employee) => {
        if (domainFilter === 'All') return true;
        return employee.domain === domainFilter;
      });
  }, [employees, search, domainFilter]);

  const openEdit = (employee) => navigate(`/employees/${employee._id}`);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee permanently?')) {
      return;
    }

    try {
      const response = await apiFetch(`/api/employees/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Unable to delete employee');
      }
      setEmployees((current) => current.filter((employee) => employee._id !== id));
      toast.success('Employee deleted successfully');
    } catch (deleteError) {
      const message = deleteError.message || 'Delete failed';
      setError(message);
      toast.error(message);
    }
  };

  const handleMarkPast = async (id) => {

    const defaultDate = new Date().toISOString().split('T')[0];
    const leftDateStr = window.prompt('Enter departure date (YYYY-MM-DD):', defaultDate);

    if (leftDateStr === null) return; // User cancelled

    try {
      const response = await apiFetch(`/api/employees/${id}/markpast`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leftDate: leftDateStr })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to mark employee as past');
      }
      setEmployees((current) => current.filter((employee) => employee._id !== id));
      toast.success('Employee marked as past');
    } catch (patchError) {
      const message = patchError.message || 'Mark as past failed';
      setError(message);
      toast.error(message);
    }
  };

  const openCredentialModal = (employee) => {
    setSelectedEmployeeForCredential(employee);
    setCredentialEmail('');
    setCredentialPassword('');
    setShowCredentialPassword(false);
    setCredentialModalOpen(true);
  };

  const submitCreateCredential = async (e) => {
    e.preventDefault();
    if (!selectedEmployeeForCredential) return;

    setCredentialLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch('/api/auth/create-employee-account', {
        method: 'POST',
        body: JSON.stringify({
          email: credentialEmail,
          password: credentialPassword,
          employeeId: selectedEmployeeForCredential._id
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create credentials');
      }

      toast.success('Credentials created successfully!');
      setCredentialModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCredentialLoading(false);
    }
  };  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Manage Employees</h2>
            <p className="mt-2 text-slate-600">Review active employees and make updates before they move to past status.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or company"
              className="w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 md:w-auto"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {domainFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setDomainFilter(filter.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                domainFilter === filter.value
                  ? 'bg-slate-950 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>}

      {loading ? (
        <div className="rounded-3xl bg-white p-12 text-center text-slate-500 shadow-sm">Loading active employees…</div>
      ) : filteredEmployees.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600 shadow-sm">
          <p className="text-lg font-semibold text-slate-950">No active employees found</p>
          <p className="mt-2">Try a different filter or refresh the page.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50 text-sm uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Domain</th>
                <th className="px-5 py-4">Salary</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
              {filteredEmployees.map((employee) => (
                <tr key={employee._id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-900">{employee.name}</div>
                    <div className="text-xs text-slate-500">{employee.previousCompany || 'No previous company'}</div>
                  </td>
                  <td className="px-5 py-4">{employee.domain}</td>
                  <td className="px-5 py-4">₹{employee.salary.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 space-x-2">
                    <button
                      type="button"
                      onClick={() => openEdit(employee)}
                      className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(employee._id)}
                      className="rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkPast(employee._id)}
                      className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                    >
                      Mark as Past
                    </button>
                    <button
                      type="button"
                      onClick={() => openCredentialModal(employee)}
                      className="rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-100 mt-2 xl:mt-0"
                    >
                      Create Login
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Credential Modal */}
      {credentialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
            <h3 className="mb-2 text-xl font-bold text-slate-900">Create Login Credentials</h3>
            <p className="mb-6 text-sm text-slate-500">For {selectedEmployeeForCredential?.name}</p>
            
            <form onSubmit={submitCreateCredential} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={credentialEmail}
                  onChange={(e) => setCredentialEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showCredentialPassword ? "text" : "password"}
                    value={credentialPassword}
                    onChange={(e) => setCredentialPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 pr-12 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCredentialPassword(!showCredentialPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showCredentialPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCredentialModalOpen(false)}
                  className="rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  disabled={credentialLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={credentialLoading}
                  className="rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
                >
                  {credentialLoading ? 'Creating...' : 'Create Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
