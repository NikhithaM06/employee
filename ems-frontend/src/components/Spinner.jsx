export default function Spinner({ message = 'Loading…' }) {
  return (
    <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
      <div className="mx-auto flex w-fit items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
