const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controller/couponController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", authMiddleware, isAdmin, createCoupon);
router.get("/all", authMiddleware, isAdmin, getAllCoupons);
router.put("/update/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
