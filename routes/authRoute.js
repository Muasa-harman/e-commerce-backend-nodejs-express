const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getAllUsers,
  getUser,
  deleteUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/register", createUser);
router.put('/updatepass',authMiddleware, updatePassword);
router.post("/login", loginUser);
router.post('/admin', loginAdmin);
router.post('/cart', authMiddleware, userCart)
router.get('/user-cart', authMiddleware, getUserCart)
router.post('/forgotpass', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword)
router.get("/get",authMiddleware,isAdmin, getAllUsers);
router.get("/get-order", authMiddleware, getOrders);
router.put("/update/:id", authMiddleware,isAdmin,updateOrderStatus)
router.post("/coupons", authMiddleware,applyCoupon);
router.post("/order", authMiddleware, createOrder)
router.get("/get/:id", authMiddleware, getUser);
router.get('/whishlist', authMiddleware, getWishlist)
router.put('/address', authMiddleware, saveAddress);
router.put("/edit-user", authMiddleware, updatedUser);
router.get("/refresh", handleRefreshToken);
router.delete("/delete/:id", deleteUser);
router.delete("/empty-cart",authMiddleware, emptyCart)
router.get('/logout', logout)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
