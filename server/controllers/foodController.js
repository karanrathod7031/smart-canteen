const Food = require("../models/Food");

const normalizeAvailability = (availabilityStatus, prepTime) => {
  const validStatuses = ["available", "preparing", "unavailable"];
  const safeStatus = validStatuses.includes(availabilityStatus)
    ? availabilityStatus
    : "available";

  const safePrepTime = Math.max(0, Number(prepTime) || 0);

  return {
    availabilityStatus: safeStatus,
    prepTime: safeStatus === "preparing" ? safePrepTime : 0,
    isAvailable: safeStatus !== "unavailable",
    estimatedAvailableTime:
      safeStatus === "preparing" && safePrepTime > 0
        ? `${safePrepTime} min`
        : "",
  };
};

exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    return res.status(200).json(foods);
  } catch (error) {
    console.error("Get foods error:", error);
    return res.status(500).json({ message: "Failed to fetch foods" });
  }
};

exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    return res.status(200).json(food);
  } catch (error) {
    console.error("Get food by id error:", error);
    return res.status(500).json({ message: "Failed to fetch food item" });
  }
};

exports.createFood = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      description,
      availabilityStatus,
      prepTime,
    } = req.body;

    if (!name || price === undefined || price === null) {
      return res.status(400).json({
        message: "Name and price are required",
      });
    }

    const availability = normalizeAvailability(availabilityStatus, prepTime);

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image
      ? String(req.body.image).trim()
      : "";

    const food = await Food.create({
      name: String(name).trim(),
      price: Number(price),
      category: category ? String(category).trim() : "General",
      description: description ? String(description).trim() : "",
      image,
      ...availability,
    });

    return res.status(201).json({
      message: "Food created successfully",
      food,
    });
  } catch (error) {
    console.error("Create food error:", error);
    return res.status(500).json({ message: "Failed to create food item" });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      description,
      availabilityStatus,
      prepTime,
    } = req.body;

    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const availability = normalizeAvailability(
      availabilityStatus ?? food.availabilityStatus,
      prepTime ?? food.prepTime
    );

    if (name !== undefined) food.name = String(name).trim();
    if (price !== undefined) food.price = Number(price);
    if (category !== undefined) food.category = String(category).trim();
    if (description !== undefined) food.description = String(description).trim();

    if (req.file) {
      food.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      food.image = String(req.body.image).trim();
    }

    food.availabilityStatus = availability.availabilityStatus;
    food.prepTime = availability.prepTime;
    food.isAvailable = availability.isAvailable;
    food.estimatedAvailableTime = availability.estimatedAvailableTime;

    await food.save();

    return res.status(200).json({
      message: "Food updated successfully",
      food,
    });
  } catch (error) {
    console.error("Update food error:", error);
    return res.status(500).json({ message: "Failed to update food item" });
  }
};

exports.updateFoodStatus = async (req, res) => {
  try {
    const { availabilityStatus, prepTime } = req.body;

    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const availability = normalizeAvailability(availabilityStatus, prepTime);

    food.availabilityStatus = availability.availabilityStatus;
    food.prepTime = availability.prepTime;
    food.isAvailable = availability.isAvailable;
    food.estimatedAvailableTime = availability.estimatedAvailableTime;

    await food.save();

    return res.status(200).json({
      message: "Food status updated successfully",
      food,
    });
  } catch (error) {
    console.error("Update food status error:", error);
    return res.status(500).json({ message: "Failed to update food status" });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    await food.deleteOne();

    return res.status(200).json({ message: "Food deleted successfully" });
  } catch (error) {
    console.error("Delete food error:", error);
    return res.status(500).json({ message: "Failed to delete food item" });
  }
};