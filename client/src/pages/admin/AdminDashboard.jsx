import { useEffect, useState } from "react";
import {
  ClipboardList,
  IndianRupee,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import { getAllOrders, getAdminAnalytics } from "../../services/orderService";
import { getFoods } from "../../services/foodService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenueToday: 0,
    itemsInMenu: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [orders, foods, analytics] = await Promise.all([
        getAllOrders(),
        getFoods(),
        getAdminAnalytics(),
      ]);

      const totalOrders = Array.isArray(orders) ? orders.length : 0;
      const pendingOrders = Array.isArray(orders)
        ? orders.filter((order) => order.status === "Pending").length
        : 0;
      const itemsInMenu = Array.isArray(foods) ? foods.length : 0;
      const revenueToday = analytics?.todayRevenue || 0;

      setStats({
        totalOrders,
        revenueToday,
        itemsInMenu,
        pendingOrders,
      });
    } catch (err) {
      console.error(
        "Admin dashboard load error:",
        err.response?.data || err.message
      );
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ClipboardList,
    },
    {
      title: "Revenue Today",
      value: `₹${stats.revenueToday}`,
      icon: IndianRupee,
    },
    {
      title: "Items in Menu",
      value: stats.itemsInMenu,
      icon: Utensils,
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: ShoppingBag,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">
          Admin Dashboard
        </h1>
      </div>

      {error && (
        <p className="mb-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-6 text-3xl font-black text-slate-900">
                {loading ? "..." : card.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}