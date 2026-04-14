import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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

  useEffect(() => {
    async function loadActiveEmployees() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/employees?status=active');
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
      const response = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
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
    if (!window.confirm('Mark this employee as past?')) {
      return;
    }

    try {
      const response = await fetch(`/api/employees/${id}/markpast`, { method: 'PATCH' });
      if (!response.ok) {
        throw new Error('Unable to mark employee as past');
      }
      setEmployees((current) => current.filter((employee) => employee._id !== id));
      toast.success('Employee marked as past');
    } catch (patchError) {
      const message = patchError.message || 'Mark as past failed';
      setError(message);
      toast.error(message);
    }
  };

  return (
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
