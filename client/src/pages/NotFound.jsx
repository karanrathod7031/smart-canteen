import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">404</p>
      <h1 className="mt-4 text-5xl font-black text-slate-900">Page not found</h1>
      <p className="mt-4 text-slate-500">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="mt-8 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800">
        Go Home
      </Link>
    </div>
  );
}