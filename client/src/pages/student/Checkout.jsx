import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { placeOrder } from "../../services/orderService";
import { formatPrice } from "../../utils/helpers";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  async function handlePlaceOrder() {
    if (!user?._id) {
      setError("Please login again");
      return;
    }

    if (!cart.length) {
      setError("Your cart is empty");
      return;
    }

    setPlacing(true);
    setError("");

    const payload = {
      studentId: user._id,
      studentName: user.name || "Student",
      items: cart.map((item) => ({
        foodId: item._id,
        quantity: Number(item.quantity),
      })),
    };

    try {
      console.log("Order payload:", payload);

      const res = await placeOrder(payload);
      console.log("Order success:", res);

      clearCart();
      navigate("/success", { replace: true });
    } catch (err) {
      console.error("Place order error:", err.response?.data || err.message);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Failed to place order"
      );
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900">Checkout</h1>
        <p className="mt-2 text-slate-500">
          Review your order before placing it.
        </p>

        <div className="mt-8 space-y-3">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
            >
              <span className="font-medium text-slate-700">
                {item.name} × {item.quantity}
              </span>

              <span className="font-semibold text-slate-900">
                {formatPrice(Number(item.price) * Number(item.quantity))}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t pt-6 text-lg font-bold text-slate-900">
          <span>Total</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>

        {error && (
          <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={placing || cart.length === 0}
          className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {placing ? "Placing order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}