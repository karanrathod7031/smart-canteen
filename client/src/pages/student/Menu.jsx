import { useEffect, useMemo, useState } from "react";
import FoodCard from "../../components/FoodCard";
import StickyCartBar from "../../components/StickyCartBar";
import { getFoods } from "../../services/foodService";

const FILTER_OPTIONS = ["all", "available", "preparing", "unavailable"];

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  async function loadFoods() {
    try {
      setLoading(true);
      setError("");
      const result = await getFoods();
      setFoods(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Load foods error:", err.response?.data || err.message);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Failed to load menu"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  const filteredAndSortedFoods = useMemo(() => {
    const priority = {
      available: 1,
      preparing: 2,
      unavailable: 3,
    };

    let result = [...foods];

    if (statusFilter !== "all") {
      result = result.filter(
        (food) => (food.availabilityStatus || "available") === statusFilter
      );
    }

    result.sort((a, b) => {
      const aStatus = a.availabilityStatus || "available";
      const bStatus = b.availabilityStatus || "available";

      if (sortBy === "price_low") {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      if (sortBy === "price_high") {
        return Number(b.price || 0) - Number(a.price || 0);
      }

      if (priority[aStatus] !== priority[bStatus]) {
        return priority[aStatus] - priority[bStatus];
      }

      if (aStatus === "preparing") {
        return Number(a.prepTime || 0) - Number(b.prepTime || 0);
      }

      return 0;
    });

    return result;
  }, [foods, statusFilter, sortBy]);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
              Student Menu
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Fresh picks for today
            </h1>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-end">
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.map((option) => {
                const active = statusFilter === option;
                const label =
                  option.charAt(0).toUpperCase() + option.slice(1);

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setStatusFilter(option)}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <label className="text-sm font-medium text-slate-500">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-slate-400"
              >
                <option value="default">Default</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {loading && <p className="text-slate-500">Loading menu...</p>}

        {error && (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {error}
          </p>
        )}

        {!loading && !error && filteredAndSortedFoods.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <p className="text-slate-500">No matching menu items found.</p>
          </div>
        )}

        <div className="grid gap-6 pb-24 md:grid-cols-2 xl:grid-cols-3">
          {filteredAndSortedFoods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      </div>

      <StickyCartBar />
    </>
  );
}