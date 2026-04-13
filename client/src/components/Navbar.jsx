import { ShoppingCart, User, UtensilsCrossed } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const navClass = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
    }`;

  const totalItems =
    cart?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-500 text-white shadow-sm">
            <UtensilsCrossed size={22} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Campus Food
            </p>
            <h1 className="text-2xl font-black text-slate-900">
              Smart Canteen
            </h1>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/menu" className={navClass}>
            Menu
          </NavLink>
          {user && (
            <NavLink to="/my-orders" className={navClass}>
              My Orders
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/cart"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </Link>

              <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 sm:flex">
                <User size={16} />
                {user.name || user.email || "User"}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:inline-flex"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}