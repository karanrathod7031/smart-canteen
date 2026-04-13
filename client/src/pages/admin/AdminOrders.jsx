import { useEffect, useMemo, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import { socket } from "../../services/socket";
import { useAdminOrderNotifications } from "../../hooks/useAdminOrderNotifications";

const STATUSES = ["Pending", "Preparing", "Completed"];

function getStatusStyle(status) {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "Preparing":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "Pending":
      return "bg-sky-50 text-sky-700 border border-sky-200";
    case "Cancelled":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    default:
      return "bg-slate-100 text-slate-700 border border-slate-200";
  }
}

function formatOrderDateTime(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getShortOrderId(orderId) {
  if (!orderId) return "N/A";
  return orderId.slice(-6).toUpperCase();
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState("");

  useAdminOrderNotifications();

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const result = await getAllOrders();
      setOrders(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Load admin orders error:", err.response?.data || err.message);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleOrderUpdated = ({ order }) => {
      if (!order?._id) return;

      setOrders((prev) => {
        const exists = prev.some((item) => item._id === order._id);

        if (!exists) {
          return [order, ...prev];
        }

        return prev.map((item) => (item._id === order._id ? order : item));
      });
    };

    socket.on("order:updated", handleOrderUpdated);

    return () => {
      socket.off("order:updated", handleOrderUpdated);
    };
  }, []);

  function toggleOrderDetails(orderId) {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  }

  async function handleStatus(orderId, status) {
    try {
      setUpdatingOrderId(orderId);
      setError("");
      await updateOrderStatus(orderId, status);
    } catch (err) {
      console.error("Update order status error:", err.response?.data || err.message);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Failed to update status"
      );
    } finally {
      setUpdatingOrderId("");
    }
  }

  const totalOrders = useMemo(() => orders.length, [orders]);

  if (loading) {
    return (
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-black text-slate-900">Manage Orders</h1>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-black text-slate-900">Manage Orders</h1>

        <div className="inline-flex w-fit rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
          Total Orders:
          <span className="ml-2 font-semibold text-slate-900">{totalOrders}</span>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}

      {!orders.length ? (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">No orders found.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => {
            const isCancelled = order.status === "Cancelled";
            const isExpanded = !!expandedOrders[order._id];
            const totalItems =
              order.items?.reduce(
                (sum, item) => sum + Number(item.quantity || 0),
                0
              ) || 0;

            return (
              <div
                key={order._id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                      <span className="font-semibold text-slate-900">
                        Order #{getShortOrderId(order._id)}
                      </span>

                      <span className="text-slate-500">
                        Student: {order.studentName || "Unknown"}
                      </span>

                      <span className="text-slate-500">
                        {formatOrderDateTime(order.createdAt)}
                      </span>

                      <span className="text-slate-500">
                        Items: {totalItems}
                      </span>

                      <span className="font-semibold text-slate-900">
                        Total: ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 xl:pl-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <select
                      value={order.status}
                      disabled={isCancelled || updatingOrderId === order._id}
                      onChange={(e) => handleStatus(order._id, e.target.value)}
                      className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                      {order.status === "Cancelled" && (
                        <option value="Cancelled">Cancelled</option>
                      )}
                    </select>

                    <button
                      onClick={() => toggleOrderDetails(order._id)}
                      className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-700">Items</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.items?.length ? (
                        order.items.map((item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                          >
                            <span className="font-medium text-slate-900">
                              {item.name}
                            </span>
                            <span className="ml-1 text-slate-500">
                              × {item.quantity}
                            </span>
                            <span className="ml-2 font-semibold text-slate-900">
                              ₹{Number(item.price || 0) * Number(item.quantity || 0)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No item details available
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}