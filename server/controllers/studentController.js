const Student = require("../models/Student");

const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existingStudent = await Student.findOne({ email: normalizedEmail });

    if (existingStudent) {
      return res.status(409).json({
        message: "Student already exists with this email",
      });
    }

    const student = await Student.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: String(password),
    });

    return res.status(201).json({
      message: "Student registered successfully",
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    console.error("Register student error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate field value detected. Please use another email.",
      });
    }

    return res.status(500).json({
      message: "Failed to register student",
    });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = String(email || "").trim().toLowerCase();

    const student = await Student.findOne({ email: normalizedEmail });

    if (!student) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await student.comparePassword(String(password || ""));

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      message: "Student login successful",
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    console.error("Login student error:", error);
    return res.status(500).json({
      message: "Failed to login student",
    });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
};