const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createbCategory,
  updateBcategory,
  deleteBcategory,
  getBcategory,
  getAllBcategories,
} = require("../controller/blogCatContoller");

const router = express.Router();

router.post("/create", authMiddleware, isAdmin, createbCategory);
router.put("/update/:id", authMiddleware, isAdmin, updateBcategory);
router.delete("/deleted/:id", authMiddleware, isAdmin, deleteBcategory);
router.get("/get/:id", authMiddleware, getBcategory);
router.get("/all", authMiddleware, getAllBcategories);
module.exports = router;
