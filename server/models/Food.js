const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
      maxlength: [100, "Food name cannot exceed 100 characters"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    category: {
      type: String,
      trim: true,
      default: "General",
      maxlength: [50, "Category cannot exceed 50 characters"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },

    // 🔴 OLD FIELD (keep for compatibility)
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },

    // 🔥 NEW SMART FIELD
    availabilityStatus: {
      type: String,
      enum: ["available", "preparing", "unavailable"],
      default: "available",
      index: true,
    },

    // 🔥 NEW: numeric prep time (important)
    prepTime: {
      type: Number,
      default: 0,
      min: [0, "Prep time cannot be negative"],
    },

    // 🔴 OLD FIELD (optional fallback UI only)
    estimatedAvailableTime: {
      type: String,
      trim: true,
      default: "",
      maxlength: [50, "Estimated time cannot exceed 50 characters"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// 🔥 Smart sync logic
foodSchema.pre("save", function (next) {
  // If available → reset prep
  if (this.availabilityStatus === "available") {
    this.prepTime = 0;
    this.estimatedAvailableTime = "";
    this.isAvailable = true;
  }

  // If preparing → must not be fully unavailable
  if (this.availabilityStatus === "preparing") {
    this.isAvailable = true;
  }

  // If unavailable → clear prep
  if (this.availabilityStatus === "unavailable") {
    this.prepTime = 0;
    this.estimatedAvailableTime = "";
    this.isAvailable = false;
  }

  next();
});

module.exports = mongoose.model("Food", foodSchema);