import { useState } from "react";
import { createFood } from "../services/foodService";

const STATUS_OPTIONS = ["available", "preparing", "unavailable"];

export default function AddFoodModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: null,
    availabilityStatus: "available",
    prepTime: "",
  });

  const [error, setError] = useState("");

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

      await createFood(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Failed to add food item"
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Add Menu Item
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add a new product to the current menu.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Food name"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
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
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              required
            />

            <input
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, category: e.target.value }))
              }
              placeholder="Category"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
            />
          </div>

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Description"
            rows="4"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          />

          <input
            id="food-image-input"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                image: e.target.files?.[0] || null,
              }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={form.availabilityStatus}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  availabilityStatus: e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status.toUpperCase()}
                </option>
              ))}
            </select>

            {form.availabilityStatus === "preparing" ? (
              <input
                value={form.prepTime}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, prepTime: e.target.value }))
                }
                type="number"
                placeholder="Preparation time (minutes)"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                required
              />
            ) : (
              <div className="hidden sm:block" />
            )}
          </div>

          {error && (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
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
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}