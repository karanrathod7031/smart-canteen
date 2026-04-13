export function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusClasses(status) {
  const map = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    preparing: "bg-sky-100 text-sky-700 border-sky-200",
    ready: "bg-emerald-100 text-emerald-700 border-emerald-200",
    completed: "bg-slate-200 text-slate-700 border-slate-300",
    cancelled: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
}