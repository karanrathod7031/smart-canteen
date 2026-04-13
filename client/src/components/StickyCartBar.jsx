import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function StickyCartBar() {
  const { cart, totalAmount, totalItems } = useCart();

  if (!cart.length) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1rem)] -translate-x-1/2 sm:bottom-5 sm:w-auto">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-900 px-4 py-3 text-white shadow-2xl sm:min-w-[520px] sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10">
            <ShoppingCart size={20} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold sm:text-base">
              {totalItems} {totalItems === 1 ? "item" : "items"} in cart
            </p>
            <p className="text-xs text-white/70 sm:text-sm">
              Total: ₹{totalAmount}
            </p>
          </div>
        </div>

        <Link
          to="/cart"
          className="shrink-0 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 sm:px-5 sm:py-2.5"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
}