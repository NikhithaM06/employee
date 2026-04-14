import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import EmployeeForm from '../components/EmployeeForm';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadEmployee() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/employees/${id}`);
        if (!response.ok) {
          throw new Error('Employee not found');
        }
        const data = await response.json();
        setEmployee(data);
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load employee profile');
      } finally {
        setLoading(false);
      }
    }

    loadEmployee();
  }, [id]);

  const handleUpdate = async (updatedData) => {
    setSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error('Unable to update employee');
      }

      const updated = await response.json();
      setEmployee(updated);
      toast.success('Employee updated successfully');
      setIsEditing(false);
    } catch (updateError) {
      const message = updateError.message || 'Update failed';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex items-center justify-center py-14 text-slate-500">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
          <span className="ml-4">Loading employee profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <button
          type="button"
          onClick={() => navigate('/employees')}
          className="mb-6 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700"
        >
          ← Back to Employees
        </button>
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate('/employees')}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-200"
          >
            ← Back to Employees
          </button>
          <h1 className="text-2xl font-semibold text-slate-950">{employee.name}</h1>
          <p className="mt-2 text-slate-600">Full employee profile and editable details.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <img
              src={employee.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'}
              alt={employee.name}
              className="h-36 w-36 rounded-[30px] object-cover"
            />
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Role</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">{employee.domain}</h2>
            </div>
            <span
              className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${
                employee.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {employee.status === 'active' ? 'Active' : 'Past'}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">About</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Age</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{employee.age}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Experience</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{employee.experience} yrs</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Salary</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">₹{employee.salary.toLocaleString('en-IN')}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Domain</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{employee.domain}</p>
            </div>
            <div className="sm:col-span-2 rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Skills</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {employee.skills?.length ? (
                  employee.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">No skills added</span>
                )}
              </div>
            </div>
            <div className="sm:col-span-2 rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Previous Company</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{employee.previousCompany || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-3xl max-h-[calc(100vh-3rem)] overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-950">Edit Employee</h3>
                <p className="text-sm text-slate-500">Update profile details and save changes.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700"
              >
                Close
              </button>
            </div>
            <EmployeeForm
              initialData={employee}
              onSubmit={handleUpdate}
              submitLabel="Save changes"
              isSubmitting={saving}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
