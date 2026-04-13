import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function getImageSrc(image) {
  if (!image) return "https://placehold.co/300x200?text=Food";
  if (image.startsWith("http")) return image;
  return `http://localhost:5000${image}`;
}

export default function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
    totalAmount,
  } = useCart();

  if (!cart || cart.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-900">Your Cart</h1>
          <p className="mt-3 text-slate-500">Your cart is empty.</p>

          <Link
            to="/menu"
            className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Your Cart</h1>
          <p className="mt-2 text-slate-500">
            Review your selected items before checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="rounded-2xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-100"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.7fr]">
        <div className="space-y-4">
          {cart.map((item) => {
            const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);

            return (
              <div
                key={item._id}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <img
                      src={getImageSrc(item.image)}
                      alt={item.name}
                      className="h-20 w-20 rounded-2xl border border-slate-200 object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-lg font-bold text-slate-900">
                        {item.name}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        ₹{item.price} each
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        Subtotal: ₹{lineTotal}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-2xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => decreaseQty(item._id)}
                        className="px-4 py-2 text-lg font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        -
                      </button>
                      <span className="min-w-[44px] text-center text-sm font-semibold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => increaseQty(item._id)}
                        className="px-4 py-2 text-lg font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item._id)}
                      className="rounded-2xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="flex items-center justify-between text-base font-bold text-slate-900">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full rounded-2xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}