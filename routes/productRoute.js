const express = require('express');
const { createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct } = require('../controller/productController');
const router = express.Router();
const { isAdmin,authMiddleware } = require('../middlewares/authMiddleware');

router.post('/create',authMiddleware,isAdmin,createProduct)
router.get('/get/:id',getaProduct)
router.get('/getall',getAllProducts)
router.put('/update/:id',authMiddleware,isAdmin, updateProduct)
router.delete('/delete/:id',authMiddleware,isAdmin,deleteProduct)

module.exports = router;