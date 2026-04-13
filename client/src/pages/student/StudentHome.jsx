import { ArrowRight, ShieldCheck, Clock3, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentHome() {
  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.25),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.18),_transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
              Fast • Smart • Secure
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Order campus food in minutes, not queues.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Smart Canteen gives students a faster, cleaner, and more modern way to explore the menu, place orders, and track updates in real time.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/menu" className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-400">
                Explore Menu <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/10">
                Create Account
              </Link>
            </div>
          </div>
           <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <Clock3 className="text-orange-400" />
              <h3 className="mt-4 text-xl font-bold">Skip waiting lines</h3>
              <p className="mt-2 text-sm text-slate-300">Pre-order food and collect when it is ready.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <ShieldCheck className="text-emerald-400" />
              <h3 className="mt-4 text-xl font-bold">Safer session flow</h3>
              <p className="mt-2 text-sm text-slate-300">Role-based route protection and centralized auth handling.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:col-span-2">
              <Sparkles className="text-sky-400" />
              <h3 className="mt-4 text-xl font-bold">Built for modern campus life</h3>
              <p className="mt-2 text-sm text-slate-300">Responsive UI, simplified ordering, and clear order tracking.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}