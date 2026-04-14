import { useEffect, useMemo, useState } from 'react';

const domainFilters = [
  { label: 'All', value: 'All' },
  { label: 'Dev', value: 'Developer' },
  { label: 'QA', value: 'QA' },
  { label: 'HR', value: 'HR' },
  { label: 'Finance', value: 'Finance' }
];

export default function PastEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');

  useEffect(() => {
    async function loadPastEmployees() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/employees?status=past');
        if (!response.ok) {
          throw new Error('Unable to load past employees');
        }
        setEmployees(await response.json());
      } catch (fetchError) {
        setError(fetchError.message || 'Failed to fetch past employees');
      } finally {
        setLoading(false);
      }
    }

    loadPastEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      if (domainFilter === 'All') return true;
      return employee.domain === domainFilter;
    });
  }, [employees, domainFilter]);

  const formatLeftDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const getReason = (employee) => {
    if (employee.previousCompany) {
      return `Moved on after working with ${employee.previousCompany}`;
    }
    return 'Transitioned to a new opportunity.';
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Past Employees</h2>
            <p className="mt-2 text-slate-600">Review former team members and their departure details.</p>
          </div>
          <div className="flex flex-wrap gap-2">
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
      </div>

      <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-900 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-yellow-700">Past employees</p>
        <p className="mt-2 text-2xl font-semibold">{employees.length} total</p>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">Loading past employees…</div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">{error}</div>
      ) : filteredEmployees.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600 shadow-sm">
          <p className="text-lg font-semibold text-slate-950">No past employees found</p>
          <p className="mt-2">Try a different filter or check back later.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredEmployees.map((employee) => (
            <div key={employee._id} className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl font-semibold text-slate-500 opacity-70">
                    {employee.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">{employee.name}</h3>
                    <p className="text-sm uppercase tracking-[0.16em] text-slate-500">{employee.domain}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Tenure</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">{employee.experience} yrs</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Left date</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">{formatLeftDate(employee.leftDate)}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-slate-100 p-4">
                  <p className="text-sm font-semibold text-slate-900">Reason for leaving</p>
                  <p className="mt-2 text-sm text-slate-600">{getReason(employee)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
