const express = require("express");
const {
  createOrder,
  getOrders,
  getStudentOrders,
  updateOrderStatus,
  cancelStudentOrder,
  getAdminAnalytics,
} = require("../controllers/orderController");

const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Student routes
router.post("/", createOrder);
router.get("/student/:studentId", getStudentOrders);
router.put("/:id/cancel", cancelStudentOrder);

// Admin routes
router.get("/", protectAdmin, getOrders);
router.get("/analytics/summary", protectAdmin, getAdminAnalytics);
router.patch("/:id/status", protectAdmin, updateOrderStatus);

module.exports = router;