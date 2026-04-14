import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        const response = await fetch('/api/employees');
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
      const response = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
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
        <div className="overflow-x-auto rounded-[28px] border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50 text-sm uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Domain</th>
                <th className="px-5 py-4">Experience</th>
                <th className="px-5 py-4">Salary</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
              {filteredEmployees.map((employee, index) => (
                <tr
                  key={employee._id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => navigate(`/employees/${employee._id}`)}
                >
                  <td className="px-5 py-4">{index + 1}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-900">{employee.name}</div>
                    <div className="text-xs text-slate-500">{employee.previousCompany || 'No previous company'}</div>
                  </td>
                  <td className="px-5 py-4">{employee.domain}</td>
                  <td className="px-5 py-4">{employee.experience} yrs</td>
                  <td className="px-5 py-4">₹{employee.salary.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 space-x-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/employees/${employee._id}`);
                      }}
                      className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(employee._id);
                      }}
                      className="rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
