import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const cardColors = ['from-sky-500', 'from-emerald-500', 'from-orange-500', 'from-fuchsia-500', 'from-cyan-500'];

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState({ companyName: '', ceo: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadClients() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) {
          throw new Error('Unable to load clients');
        }
        setClients(await response.json());
      } catch (fetchError) {
        setError(fetchError.message || 'Failed to fetch client data');
      } finally {
        setLoading(false);
      }
    }

    loadClients();
  }, []);


  const accentForClient = (index) => cardColors[index % cardColors.length];

  const openDetails = (client) => setSelectedClient(client);
  const closeDetails = () => setSelectedClient(null);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (!formState.companyName.trim() || !formState.ceo.trim() || !formState.description.trim()) {
        throw new Error('All fields are required');
      }

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });

      if (!response.ok) {
        throw new Error('Unable to save client');
      }

      const createdClient = await response.json();
      setClients((current) => [createdClient, ...current]);
      setFormState({ companyName: '', ceo: '', description: '' });
      setShowForm(false);
      toast.success('Client added successfully');
    } catch (submitError) {
      const message = submitError.message || 'Unable to create client';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Clients</h2>
            <p className="mt-2 text-slate-600">Manage active clients and view company details in one place.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add Client
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading clients…
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">{error}</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {clients.map((client, index) => (
            <div
              key={client._id}
              className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`h-2 bg-gradient-to-r ${accentForClient(index)} to-slate-900`} />
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl font-semibold text-slate-900">
                    {client.companyName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">{client.companyName}</h3>
                    <p className="text-sm uppercase tracking-[0.16em] text-slate-500">CEO: {client.ceo}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Ongoing</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">{client.ongoingProjects}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Completed</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">{client.completedProjects}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl text-sm text-slate-500">{client.description || 'No description available.'}</p>
                  <button
                    type="button"
                    onClick={() => openDetails(client)}
                    className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedClient ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-slate-950">{selectedClient.companyName}</h3>
                <p className="mt-1 text-slate-600">CEO: {selectedClient.ceo}</p>
              </div>
              <button
                type="button"
                onClick={closeDetails}
                className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700"
              >
                Close
              </button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Ongoing projects</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{selectedClient.ongoingProjects}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Completed projects</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{selectedClient.completedProjects}</p>
              </div>
            </div>
            <div className="mt-6 rounded-3xl bg-slate-100 p-6">
              <h4 className="text-sm uppercase tracking-[0.18em] text-slate-500">About this client</h4>
              <p className="mt-4 text-slate-700">{selectedClient.description || 'No additional information provided.'}</p>
            </div>
          </div>
        </div>
      ) : null}

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-slate-950">Add Client</h3>
                <p className="mt-1 text-slate-600">Create a new client company record.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-700">Company Name</span>
                  <input
                    name="companyName"
                    value={formState.companyName}
                    onChange={handleFormChange}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-700">CEO</span>
                  <input
                    name="ceo"
                    value={formState.ceo}
                    onChange={handleFormChange}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
              </div>
              <label className="space-y-2">
                <span className="block text-sm font-medium text-slate-700">Description</span>
                <textarea
                  name="description"
                  value={formState.description}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </label>
              {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {submitting ? 'Saving…' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
