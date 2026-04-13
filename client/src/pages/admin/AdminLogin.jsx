import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const result = await adminLogin(form);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/admin", { replace: true });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-black/30">
        <h1 className="text-3xl font-black text-white">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-400">Secure access for canteen administrators.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Admin email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-orange-500"
            required
          />

          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-orange-500"
            required
          />

          {error && (
            <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-400 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}