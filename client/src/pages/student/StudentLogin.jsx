import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function StudentLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { studentLogin, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const result = await studentLogin(form);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(location.state?.from?.pathname || "/menu", { replace: true });
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-90px)] max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-black text-slate-900">Student Login</h1>
        <p className="mt-2 text-sm text-slate-500">Access your canteen account securely.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-slate-900"
            required
          />

          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-slate-900"
            required
          />

          {error && (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          New here? <Link to="/register" className="font-semibold text-orange-600">Create an account</Link>
        </p>
      </div>
    </div>
  );
}