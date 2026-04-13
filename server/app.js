// const express = require("express");
// const cors = require("cors");
// const path = require("path");

// require("dotenv").config();

// const adminRoutes = require("./routes/adminRoutes");
// const authRoutes = require("./routes/authRoutes");
// const foodRoutes = require("./routes/foodRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const studentRoutes = require("./routes/studentRoutes");
// const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// const app = express();

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://smart-canteen-delta.vercel.app",
// ];

// // Extra-safe manual headers
// app.use((req, res, next) => {
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     res.header("Access-Control-Allow-Origin", origin);
//   }

//   res.header("Vary", "Origin");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(204);
//   }

//   next();
// });

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.get("/", (req, res) => {
//   res.status(200).json({ message: "Smart Canteen API is running" });
// });

// app.use("/api", authRoutes);
// app.use("/api/foods", foodRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/students", studentRoutes);
// // app.use("/api/admin", adminRoutes);

// app.use(notFound);
// app.use(errorHandler);

// module.exports = app;



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

// TEMPORARY PRODUCTION FIX: allow all origins
app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Smart Canteen API is running" });
});

app.use("/api", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/students", studentRoutes);
// app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;