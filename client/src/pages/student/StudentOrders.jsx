import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder } from "../../services/orderService";
import { useAuth } from "../../context/AuthContext";
import { socket } from "../../services/socket";

function formatReadyTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatOrderDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

function getImageSrc(item) {
  const image = item?.foodId?.image;
  if (!image) return "https://placehold.co/200x200?text=Food";
  if (image.startsWith("http")) return image;
  return `http://localhost:5000${image}`;
}

export default function StudentOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      if (!user?._id) {
        setError("Student not logged in");
        return;
      }

      const result = await getMyOrders(user._id);
      setOrders(result);
    } catch (err) {
      console.error("Load student orders error:", err.response?.data || err.message);
      setError(
        err?.response?.data?.msg ||
          err?.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(orderId) {
    try {
      setError("");

      if (!user?._id) {
        setError("Student not logged in");
        return;
      }

      await cancelOrder(orderId, user._id);
    } catch (err) {
      console.error("Cancel order error:", err.response?.data || err.message);
      setError(
        err?.response?.data?.msg ||
          err?.response?.data?.message ||
          "Failed to cancel order"
      );
    }
  }

  useEffect(() => {
    loadOrders();
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join:student", user._id);

    const handleStudentOrderUpdated = ({ order }) => {
      setOrders((prev) => {
        const exists = prev.some((item) => item._id === order._id);

        if (!exists) {
          return [order, ...prev];
        }

        return prev.map((item) => (item._id === order._id ? order : item));
      });
    };

    socket.on("student:order:updated", handleStudentOrderUpdated);

    return () => {
      socket.emit("leave:student", user._id);
      socket.off("student:order:updated", handleStudentOrderUpdated);
    };
  }, [user?._id]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          My Orders
        </h1>
        <p className="mt-2 text-base text-slate-500">
          Track your recent canteen orders.
        </p>
      </div>

      {loading && <p className="text-slate-500">Loading orders...</p>}

      {error && (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <p className="text-slate-500">No orders found yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => {
          const canCancel =
            order.status === "Pending" || order.status === "Preparing";

          const totalQty =
            order.items?.reduce(
              (sum, item) => sum + Number(item.quantity || 0),
              0
            ) || 0;

          return (
            <div
              key={order._id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">Order ID</p>
                  <p className="mt-1 break-all text-lg font-bold text-slate-900">
                    {order._id}
                  </p>
                  {order.createdAt && (
                    <p className="mt-1 text-sm text-slate-500">
                      {formatOrderDate(order.createdAt)}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => handleCancel(order._id)}
                      className="rounded-2xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1 space-y-3">
                  {order.items?.map((item, index) => {
                    const lineTotal =
                      Number(item.price || 0) * Number(item.quantity || 0);

                    return (
                      <div
                        key={`${order._id}-${index}`}
                        className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-3"
                      >
                        <img
                          src={getImageSrc(item)}
                          alt={item.name}
                          className="h-16 w-16 rounded-2xl border border-slate-200 object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-bold text-slate-900">
                            {item.name}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                            <p>Qty: {item.quantity}</p>
                            <p>₹{item.price} each</p>
                            <p className="font-medium text-slate-700">
                              ₹{lineTotal}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="w-full rounded-2xl bg-slate-50 p-4 lg:w-64">
                  <p className="text-sm font-medium text-slate-500">
                    Order Summary
                  </p>

                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Items</span>
                      <span>{order.items?.length || 0}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500">
                      <span>Quantity</span>
                      <span>{totalQty}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-base font-bold text-slate-900">
                      <span>Total</span>
                      <span>₹{order.totalAmount}</span>
                    </div>
                  </div>

                  {order.readyAt && order.status !== "Cancelled" && (
                    <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                      Ready at {formatReadyTime(order.readyAt)}
                    </div>
                  )}

                  {order.status === "Cancelled" && (
                    <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                      Order cancelled
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}