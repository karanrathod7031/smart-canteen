import { useEffect, useState } from "react";
import { updateFood } from "../services/foodService";

const STATUS_OPTIONS = ["available", "preparing", "unavailable"];

export default function EditFoodModal({ food, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: food?.name || "",
    price: food?.price || "",
    category: food?.category || "",
    description: food?.description || "",
    image: null,
    availabilityStatus: food?.availabilityStatus || "available",
    prepTime: food?.prepTime || "",
  });

  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const currentImageSrc = food?.image
    ? food.image.startsWith("http")
      ? food.image
      : `http://localhost:5000${food.image}`
    : "https://placehold.co/300x200?text=Food";

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", Number(form.price));
      formData.append("category", form.category || "General");
      formData.append("description", form.description);
      formData.append("availabilityStatus", form.availabilityStatus);
      formData.append(
        "prepTime",
        form.availabilityStatus === "preparing"
          ? Number(form.prepTime || 0)
          : 0
      );

      if (form.image) {
        formData.append("image", form.image);
      }

      await updateFood(food._id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Failed to update food item"
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Edit Menu Item
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Update item details, pricing, image, and availability.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5"
        >
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
              <h3 className="text-sm font-semibold text-slate-700">
                Basic Information
              </h3>

              <div className="mt-4 space-y-4">
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Food name"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                  required
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    type="number"
                    placeholder="Price"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                    required
                  />

                  <input
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                    placeholder="Category"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                  />
                </div>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Description"
                  rows="4"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
                <h3 className="text-sm font-semibold text-slate-700">Image</h3>

                <div className="mt-4 flex items-center gap-4">
                  <img
                    src={preview || currentImageSrc}
                    alt={food?.name}
                    className="h-24 w-24 rounded-2xl border border-slate-200 object-cover bg-white"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-700">
                      Current image
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Upload a new image to replace it.
                    </p>
                    {form.image && (
                      <p className="mt-2 truncate text-xs font-medium text-slate-600">
                        Selected: {form.image.name}
                      </p>
                    )}
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (preview) {
                      URL.revokeObjectURL(preview);
                    }

                    setForm((prev) => ({
                      ...prev,
                      image: file,
                    }));
                    setPreview(URL.createObjectURL(file));
                  }}
                  className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                />
              </div>

              <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
                <h3 className="text-sm font-semibold text-slate-700">
                  Availability
                </h3>

                <div className="mt-4 space-y-4">
                  <select
                    value={form.availabilityStatus}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        availabilityStatus: e.target.value,
                        prepTime:
                          e.target.value === "preparing" ? prev.prepTime : "",
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.toUpperCase()}
                      </option>
                    ))}
                  </select>

                  {form.availabilityStatus === "preparing" && (
                    <input
                      value={form.prepTime}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          prepTime: e.target.value,
                        }))
                      }
                      type="number"
                      placeholder="Preparation time (minutes)"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                      required
                    />
                  )}
                </div>
              </div>
            </div>

            {error && (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {error}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Update Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}