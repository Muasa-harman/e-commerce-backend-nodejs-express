const express = require('express');
const { createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct, addToWishList, rating } = require('../controller/productController');
const router = express.Router();
const { isAdmin,authMiddleware } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');

router.post('/create',authMiddleware,isAdmin,createProduct)
router.put('/upload/:id', authMiddleware,isAdmin, uploadPhoto.array('images',10),productImgResize)
router.get('/get/:id',getaProduct)
router.get('/getall',getAllProducts)
router.put('/update/:id',authMiddleware,isAdmin, updateProduct)
router.delete('/delete/:id',authMiddleware,isAdmin,deleteProduct)
router.put('/wishlist', authMiddleware,isAdmin,addToWishList)
router.put('/rating', authMiddleware, rating)
module.exports = router;