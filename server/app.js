const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const studentRoutes = require("./routes/studentRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

/* =========================
   ✅ FINAL CORS CONFIG
========================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smart-canteen-delta.vercel.app",
    ],
    credentials: true,
  })
);

// Handle preflight (VERY IMPORTANT)
app.options("*", cors());

/* =========================
   BODY PARSING
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC FILES
========================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.status(200).json({ message: "Smart Canteen API is running" });
});

/* =========================
   ROUTES
========================= */
app.use("/api", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/students", studentRoutes);
// app.use("/api/admin", adminRoutes);

/* =========================
   ERROR HANDLING
========================= */
app.use(notFound);
app.use(errorHandler);

module.exports = app;