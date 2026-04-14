import { useEffect, useState } from 'react';

const serviceAccent = {
  Apps: 'from-sky-500',
  Websites: 'from-emerald-500',
  'E-Commerce': 'from-orange-500',
  Maintenance: 'from-fuchsia-500'
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadServices() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/services');
        if (!response.ok) {
          throw new Error('Unable to load services');
        }
        setServices(await response.json());
      } catch (fetchError) {
        setError(fetchError.message || 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-950">Services Offered</h2>
        <p className="mt-2 text-slate-600">Explore the core service offerings available to your clients.</p>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">Loading services…</div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">{error}</div>
      ) : services.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600 shadow-sm">
          <p className="text-lg font-semibold text-slate-950">No services available</p>
          <p className="mt-2">There are currently no services configured. Seed the backend or add services to the database.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <div key={service._id} className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
              <div className={`h-2 bg-gradient-to-r ${serviceAccent[service.name] || 'from-slate-500'} to-slate-900`} />
              <div className="p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl font-semibold text-slate-950">
                    {service.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">{service.name}</h3>
                    <p className="text-sm text-slate-500">{service.description}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Active projects</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-950">{service.activeProjects}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Completed</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-950">{service.completedProjects}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
