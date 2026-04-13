const generateToken = require("../utils/generateToken");

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPassword = String(password || "").trim();

  if (!normalizedEmail || !normalizedPassword) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (
    normalizedEmail !== process.env.ADMIN_EMAIL.toLowerCase() ||
    normalizedPassword !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const token = generateToken({
    role: "admin",
    email: process.env.ADMIN_EMAIL,
  });

  res.status(200).json({
    message: "Admin login successful",
    token,
    admin: {
      email: process.env.ADMIN_EMAIL,
      role: "admin",
    },
  });
};

const getAdminProfile = async (req, res) => {
  res.status(200).json({
    admin: {
      email: req.admin.email,
      role: req.admin.role,
    },
  });
};

module.exports = {
  loginAdmin,
  getAdminProfile,
};