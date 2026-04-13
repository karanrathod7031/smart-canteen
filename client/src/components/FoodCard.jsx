import { useCart } from "../context/CartContext";

function getImageSrc(image) {
  if (!image) return "https://placehold.co/600x400?text=Food";
  if (image.startsWith("http")) return image;
  return `http://localhost:5000${image}`;
}

export default function FoodCard({ food }) {
  const { addToCart } = useCart();

  const status = food.availabilityStatus || "available";
  const prepTime = Number(food.prepTime || 0);

  const isAvailable = status === "available";
  const isPreparing = status === "preparing";
  const isUnavailable = status === "unavailable";

  function handleAdd() {
    if (!isUnavailable) {
      addToCart(food);
    }
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <img
        src={getImageSrc(food.image)}
        alt={food.name}
        className="h-64 w-full object-cover"
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{food.name}</h3>
            <p className="mt-2 text-sm text-slate-500">
              {food.description || "Freshly prepared canteen favorite."}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
            ₹{food.price}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isAvailable
                ? "bg-emerald-50 text-emerald-700"
                : isPreparing
                ? "bg-amber-50 text-amber-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {isAvailable && "Available"}
            {isPreparing && "Preparing"}
            {isUnavailable && "Unavailable"}
          </span>

          {isPreparing && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              ⏱ Ready in {prepTime} min
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={isUnavailable}
          className={`mt-5 w-full rounded-2xl py-3 font-semibold transition ${
            isAvailable
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : isPreparing
              ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          {isAvailable && "Order Now"}
          {isPreparing && `Ready in ${prepTime} min`}
          {isUnavailable && "Not Available"}
        </button>
      </div>
    </article>
  );
}