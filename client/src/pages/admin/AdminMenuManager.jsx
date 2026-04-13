import { useEffect, useState } from "react";
import {
  deleteFood,
  getFoods,
  updateFoodStatus,
} from "../../services/foodService";
import { formatPrice } from "../../utils/helpers";
import AddFoodModal from "../../components/AddFoodModal";
import EditFoodModal from "../../components/EditFoodModal";

const STATUS_OPTIONS = ["available", "preparing", "unavailable"];

const STATUS_STYLES = {
  available: "bg-emerald-50 text-emerald-700",
  preparing: "bg-amber-50 text-amber-700",
  unavailable: "bg-rose-50 text-rose-700",
};

export default function AdminMenuManager() {
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  async function loadFoods() {
    try {
      setError("");
      const result = await getFoods();
      setFoods(result);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Failed to load menu items"
      );
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  async function handleDelete(id) {
    try {
      setError("");
      await deleteFood(id);
      await loadFoods();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Failed to delete item"
      );
    }
  }

  async function handleStatusUpdate(foodId, availabilityStatus, prepTime) {
    try {
      setError("");
      await updateFoodStatus(foodId, {
        availabilityStatus,
        prepTime:
          availabilityStatus === "preparing" ? Number(prepTime || 0) : 0,
      });

      await loadFoods();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Failed to update food status"
      );
    }
  }

  const getImageSrc = (image) => {
    if (!image) return "https://placehold.co/300x200?text=Food";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000${image}`;
  };

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Current Menu</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage availability, preparation time, and item visibility.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            + Add Item
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-4">
          {foods.map((food) => (
            <div
              key={food._id}
              className="rounded-3xl border border-slate-200 bg-slate-50/60 p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 flex-1 gap-4">
                  <img
                    src={getImageSrc(food.image)}
                    alt={food.name}
                    className="h-24 w-24 shrink-0 rounded-2xl border border-slate-200 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-bold text-slate-900">
                      {food.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {food.description || "No description added."}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                      <p className="font-semibold text-orange-600">
                        {formatPrice(food.price)}
                      </p>
                      <p className="text-slate-500">
                        Category: {food.category || "General"}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          STATUS_STYLES[food.availabilityStatus || "available"]
                        }`}
                      >
                        {food.availabilityStatus || "available"}
                      </span>

                      {(food.availabilityStatus || "available") === "preparing" && (
                        <span className="text-sm font-medium text-slate-500">
                          • {food.prepTime || 0} min
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
                  <select
                    value={food.availabilityStatus || "available"}
                    onChange={(e) =>
                      handleStatusUpdate(
                        food._id,
                        e.target.value,
                        food.prepTime || 0
                      )
                    }
                    className="h-11 min-w-[150px] rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-slate-400"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  {(food.availabilityStatus || "available") === "preparing" && (
                    <input
                      type="number"
                      min="0"
                      defaultValue={food.prepTime || 0}
                      onBlur={(e) =>
                        handleStatusUpdate(
                          food._id,
                          "preparing",
                          e.target.value
                        )
                      }
                      className="h-11 w-24 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
                      placeholder="Min"
                    />
                  )}

                  <button
                    onClick={() => setEditItem(food)}
                    className="h-11 rounded-2xl bg-sky-50 px-5 text-sm font-semibold text-sky-600 hover:bg-sky-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(food._id)}
                    className="h-11 rounded-2xl bg-rose-50 px-5 text-sm font-semibold text-rose-600 hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!foods.length && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <p className="text-slate-500">No menu items added yet.</p>
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <AddFoodModal
          onClose={() => setShowModal(false)}
          onSuccess={loadFoods}
        />
      )}

      {editItem && (
        <EditFoodModal
          food={editItem}
          onClose={() => setEditItem(null)}
          onSuccess={loadFoods}
        />
      )}
    </>
  );
}