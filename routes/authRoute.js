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
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/register", createUser);
router.put('/updatepass',authMiddleware, updatePassword);
router.post("/login", loginUser);
router.post('/forgotpass', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword)
router.get("/get", getAllUsers);
router.get("/get/:id", authMiddleware, getUser);
router.put("/edit-user", authMiddleware, updatedUser);
router.get("/refresh", handleRefreshToken);
router.delete("/delete/:id", deleteUser);
router.get('/logout', logout)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
