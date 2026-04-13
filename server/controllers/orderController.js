const mongoose = require("mongoose");
const Food = require("../models/Food");
const Order = require("../models/Order");
const { getIO } = require("../socket");

const ALLOWED_ORDER_STATUSES = ["Pending", "Preparing", "Completed", "Cancelled"];
const REVENUE_STATUSES = ["Pending", "Preparing", "Completed"];
const STUDENT_CANCELLABLE_STATUSES = ["Pending", "Preparing"];
const ADMIN_EDITABLE_STATUSES = ["Pending", "Preparing", "Completed"];

const emitOrderUpdate = (order, type = "updated") => {
  const io = getIO();

  io.emit("order:updated", {
    type,
    order,
  });

  if (order?.studentId) {
    io.to(`student:${String(order.studentId)}`).emit("student:order:updated", {
      type,
      order,
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const { studentId, studentName, items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const normalizedItems = [];
    let maxPrepTime = 0;

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (!item.foodId || !quantity || quantity < 1) {
        return res.status(400).json({
          message: "Each item must have foodId and valid quantity",
        });
      }

      const food = await Food.findById(item.foodId);

      if (!food) {
        return res.status(404).json({
          message: `Food item not found: ${item.foodId}`,
        });
      }

      if (food.availabilityStatus === "unavailable") {
        return res.status(400).json({
          message: `${food.name} is currently unavailable`,
        });
      }

      const prepTime = Number(food.prepTime || 0);

      if (food.availabilityStatus === "preparing") {
        maxPrepTime = Math.max(maxPrepTime, prepTime);
      }

      normalizedItems.push({
        foodId: food._id,
        name: food.name,
        price: food.price,
        quantity,
      });
    }

    const totalAmount = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const readyAt =
      maxPrepTime > 0
        ? new Date(Date.now() + maxPrepTime * 60 * 1000)
        : null;

    const order = await Order.create({
      studentId: studentId || null,
      studentName: String(studentName || "").trim(),
      items: normalizedItems,
      totalAmount,
      status: "Pending",
      readyAt,
    });

    const populatedOrder = await Order.findById(order._id).populate(
      "items.foodId",
      "image name"
    );

    emitOrderUpdate(populatedOrder, "created");

    return res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const getStudentOrders = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Valid studentId is required" });
    }

    const orders = await Order.find({ studentId })
      .populate("items.foodId", "image name")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Get student orders error:", error);
    return res.status(500).json({ message: "Failed to fetch student orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!ALLOWED_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({
        message: "Cancelled orders cannot be updated by admin",
      });
    }

    if (!ADMIN_EDITABLE_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Admin can only set Pending, Preparing, or Completed",
      });
    }

    order.status = status;
    await order.save();

    const populatedOrder = await Order.findById(order._id).populate(
      "items.foodId",
      "image name"
    );

    emitOrderUpdate(populatedOrder, "status_changed");

    return res.status(200).json({
      message: "Order status updated successfully",
      order: populatedOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update order status" });
  }
};

const cancelStudentOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Valid order id is required" });
    }

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Valid studentId is required" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.studentId || String(order.studentId) !== String(studentId)) {
      return res.status(403).json({
        message: "You are not allowed to cancel this order",
      });
    }

    if (!STUDENT_CANCELLABLE_STATUSES.includes(order.status)) {
      return res.status(400).json({
        message: "This order can no longer be cancelled",
      });
    }

    order.status = "Cancelled";
    await order.save();

    const populatedOrder = await Order.findById(order._id).populate(
      "items.foodId",
      "image name"
    );

    emitOrderUpdate(populatedOrder, "cancelled");

    return res.status(200).json({
      message: "Order cancelled successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Cancel student order error:", error);
    return res.status(500).json({
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};

const getAdminAnalytics = async (req, res) => {
  try {
    const now = new Date();

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const yearStart = new Date(now.getFullYear(), 0, 1);
    const nextYearStart = new Date(now.getFullYear() + 1, 0, 1);

    const revenuePipeline = (start, end) => [
      {
        $match: {
          createdAt: { $gte: start, $lt: end },
          status: { $in: REVENUE_STATUSES },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ];

    const itemPipeline = (start, end, limit) => [
      {
        $match: {
          createdAt: { $gte: start, $lt: end },
          status: { $in: REVENUE_STATUSES },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.foodId",
          name: { $first: "$items.name" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalQuantity: -1, totalRevenue: -1 } },
      { $limit: limit },
    ];

    const [
      todayRevenueData,
      monthlyRevenueData,
      yearlyRevenueData,
      topSellingToday,
      topSellingThisMonth,
    ] = await Promise.all([
      Order.aggregate(revenuePipeline(todayStart, tomorrowStart)),
      Order.aggregate(revenuePipeline(monthStart, nextMonthStart)),
      Order.aggregate(revenuePipeline(yearStart, nextYearStart)),
      Order.aggregate(itemPipeline(todayStart, tomorrowStart, 5)),
      Order.aggregate(itemPipeline(monthStart, nextMonthStart, 10)),
    ]);

    return res.status(200).json({
      todayRevenue: todayRevenueData[0]?.totalRevenue || 0,
      todayOrders: todayRevenueData[0]?.totalOrders || 0,
      monthlyRevenue: monthlyRevenueData[0]?.totalRevenue || 0,
      monthlyOrders: monthlyRevenueData[0]?.totalOrders || 0,
      yearlyRevenue: yearlyRevenueData[0]?.totalRevenue || 0,
      yearlyOrders: yearlyRevenueData[0]?.totalOrders || 0,
      topSellingToday,
      topSellingThisMonth,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch analytics" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getStudentOrders,
  updateOrderStatus,
  cancelStudentOrder,
  getAdminAnalytics,
};