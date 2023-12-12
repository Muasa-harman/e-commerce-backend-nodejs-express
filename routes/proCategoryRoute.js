const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createCategory } = require("../controller/proCategoryController");
const router = express.Router();

router.post('/create', authMiddleware,isAdmin, createCategory)

module.exports=router;