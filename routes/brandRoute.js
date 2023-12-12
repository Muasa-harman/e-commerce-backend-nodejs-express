const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand } = require("../controller/brandController");

const router = express.Router();

router.post('/create', authMiddleware,isAdmin, createBrand)
router.put('/update/:id',authMiddleware,isAdmin, updateBrand)
router.delete('/deleted/:id', authMiddleware,isAdmin,deleteBrand)
router.get('/get/:id',authMiddleware, getBrand)
router.get('/all',authMiddleware, getAllBrand)
module.exports=router;