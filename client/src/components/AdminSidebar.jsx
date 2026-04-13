import { LayoutDashboard, UtensilsCrossed, ClipboardList, BarChart3, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkBase =
  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all";

export default function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-full border-b border-slate-800 bg-slate-950 text-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="p-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-500/20 text-orange-400">
            <UtensilsCrossed size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Admin</p>
            <h2 className="text-xl font-bold">Smart Canteen</h2>
          </div>
        </div>
         <nav className="space-y-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `${linkBase} ${isActive ? "bg-white text-slate-900" : "text-slate-300 hover:bg-slate-900 hover:text-white"}`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink
            to="/admin/menu"
            className={({ isActive }) => `${linkBase} ${isActive ? "bg-white text-slate-900" : "text-slate-300 hover:bg-slate-900 hover:text-white"}`}
          >
            <UtensilsCrossed size={18} /> Menu Manager
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `${linkBase} ${isActive ? "bg-white text-slate-900" : "text-slate-300 hover:bg-slate-900 hover:text-white"}`}
          >
            <ClipboardList size={18} /> Orders
          </NavLink>
          <NavLink
            to="/admin/analytics"
            className={({ isActive }) => `${linkBase} ${isActive ? "bg-white text-slate-900" : "text-slate-300 hover:bg-slate-900 hover:text-white"}`}
          >
            <BarChart3 size={18} /> Analytics
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={logout}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}