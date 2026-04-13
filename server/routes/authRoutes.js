const express = require("express");
const {
  studentRegister,
  studentLogin,
  adminLogin,
} = require("../controllers/authController");

const router = express.Router();

// Student routes
router.post("/students/register", studentRegister);
router.post("/students/login", studentLogin);

// Admin route
router.post("/admin/login", adminLogin);

module.exports = router;