import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiFetch from '../utils/api';

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEmployees() {
      setLoading(true);
      setError('');
      try {
        const response = await apiFetch('/api/employees');
        if (!response.ok) {
          throw new Error('Failed to load employees');
        }
        const data = await response.json();
        setEmployees(data);
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to fetch employees');
      } finally {
        setLoading(false);
      }
    }

    loadEmployees();
  }, []);

  const filteredEmployees = useMemo(
    () =>
      employees.filter((employee) =>
        employee.name.toLowerCase().includes(search.toLowerCase())
      ),
    [employees, search]
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) {
      return;
    }

    try {
      const response = await apiFetch(`/api/employees/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Unable to delete employee');
      }
      setEmployees((current) => current.filter((employee) => employee._id !== id));
    } catch (deleteError) {
      setError(deleteError.message || 'Delete request failed');
    }
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Employees</h2>
          <p className="mt-2 text-slate-600">All team members are listed below. Use search to filter by name.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => navigate('/employees/new')}
            className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add New Employee
          </button>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name"
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 md:w-auto"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-14">
          <div className="flex items-center gap-3 text-slate-500">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
            <span>Loading employees…</span>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>
      ) : filteredEmployees.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
          <p className="text-lg font-medium text-slate-900">No employees found</p>
          <p className="mt-2">Try changing your search or add new employees in the backend.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEmployees.map((employee) => (
            <div
              key={employee._id}
              onClick={() => navigate(`/employees/${employee._id}`)}
              className="group relative flex cursor-pointer flex-col rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50"
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                    {employee.name}
                  </h3>
                  <p className="text-sm font-medium text-slate-500">
                    {employee.domain}
                  </p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-blue-600">
                  {employee.name ? employee.name.charAt(0).toUpperCase() : '?'}
                </div>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">Experience</p>
                  <p className="mt-0.5 font-semibold text-slate-800">{employee.experience} yrs</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">Salary</p>
                  <p className="mt-0.5 font-semibold text-slate-800">₹{employee.salary?.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/employees/${employee._id}`);
                  }}
                  className="flex-1 rounded-2xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 hover:text-slate-900"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDelete(employee._id);
                  }}
                  className="flex-1 rounded-2xl bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
