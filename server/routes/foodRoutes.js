const express = require("express");
const {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  updateFoodStatus,
  deleteFood,
} = require("../controllers/foodController");
const { protectAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getFoods);
router.get("/:id", getFoodById);

router.post("/", protectAdmin, upload.single("image"), createFood);
router.put("/:id", protectAdmin, upload.single("image"), updateFood);
router.patch("/:id/status", protectAdmin, updateFoodStatus);
router.delete("/:id", protectAdmin, deleteFood);

module.exports = router;