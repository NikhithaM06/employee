import { useEffect, useState } from 'react';
import apiFetch from '../utils/api';

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
        const response = await apiFetch('/api/services');
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
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {services.map((service) => (
            <div key={service._id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col items-center justify-center p-6 text-center hover:-translate-y-1 hover:shadow-md transition aspect-square relative">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${serviceAccent[service.name] || 'from-slate-500'} to-slate-400 opacity-50`} />
              
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-2xl font-bold text-slate-700 mb-3 group-hover:bg-slate-100 transition">
                {service.name.charAt(0)}
              </div>
              <h3 className="text-sm font-semibold text-slate-950 truncate w-full px-2">{service.name}</h3>
              
              <div className="mt-auto w-full pt-3 border-t border-slate-100 flex justify-between px-2">
                 <div className="text-center">
                    <p className="text-[9px] uppercase tracking-widest text-slate-400">Act</p>
                    <p className="text-xs font-semibold text-slate-700">{service.activeProjects}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[9px] uppercase tracking-widest text-slate-400">Done</p>
                    <p className="text-xs font-semibold text-slate-700">{service.completedProjects}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
