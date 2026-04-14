export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600 shadow-sm">
      <p className="text-lg font-semibold text-slate-950">{title}</p>
      <p className="mt-2">{description}</p>
    </div>
  );
}
