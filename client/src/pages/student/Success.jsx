import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-90px)] max-w-4xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full rounded-3xl border border-emerald-200 bg-white p-10 text-center shadow-sm">
        <CheckCircle2 className="mx-auto text-emerald-500" size={64} />
        <h1 className="mt-6 text-3xl font-black text-slate-900">Order placed successfully</h1>
        <p className="mt-3 text-slate-500">Your food is now being processed by the canteen team.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/my-orders" className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800">
            View My Orders
          </Link>
          <Link to="/menu" className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50">
            Order More
          </Link>
        </div>
      </div>
    </div>
  );
}