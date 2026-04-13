export default function StatCard({ title, value, helperText = "", loading = false }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-2xl font-black text-slate-900">
        {loading ? "..." : value}
      </p>
      {helperText ? (
        <p className="mt-2 text-xs font-medium text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}