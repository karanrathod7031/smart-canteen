import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function StudentRegister() {
  const navigate = useNavigate();
  const { studentRegister, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const result = await studentRegister(form);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/menu", { replace: true });
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-90px)] max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-black text-slate-900">Create Account</h1>
        <p className="mt-2 text-sm text-slate-500">Join Smart Canteen and start ordering faster.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-slate-900"
            required
          />

          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-slate-900"
            required
          />

          <input
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-slate-900"
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
            className="w-full rounded-2xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-400 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Already registered? <Link to="/login" className="font-semibold text-slate-900">Login</Link>
        </p>
      </div>
    </div>
  );
}