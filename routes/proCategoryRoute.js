const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
} = require("../controller/proCategoryController");
const { get } = require("mongoose");

const router = express.Router();

router.post("/create", authMiddleware, isAdmin, createCategory);
router.put("/update/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/deleted/:id", authMiddleware, isAdmin, deleteCategory);
router.get("/get/:id", authMiddleware, getCategory);
router.get("/all", authMiddleware, getAllCategories);
module.exports = router;
