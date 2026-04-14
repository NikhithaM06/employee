import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EmployeeForm from '../components/EmployeeForm';

const blankEmployee = {
  name: '',
  age: '',
  experience: '',
  previousCompany: '',
  domain: 'Developer',
  skills: [],
  salary: '',
  image: ''
};

export default function AddEmployee() {
  const navigate = useNavigate();
  const [formKey, setFormKey] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null);
        const message = errorResponse?.message || 'Unable to save employee';
        throw new Error(message);
      }

      toast.success('Employee added successfully');
      setFormKey(Date.now());
      window.setTimeout(() => {
        navigate('/employees');
      }, 800);
    } catch (submitError) {
      const message = submitError.message || 'Save failed';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Add New Employee</h2>
          <p className="mt-2 text-slate-600">Fill in the form to add a new team member.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <EmployeeForm
          key={formKey}
          initialData={blankEmployee}
          onSubmit={handleSubmit}
          submitLabel="Create employee"
          isSubmitting={submitting}
        />
      </div>
    </div>
  );
}
