const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createBlog, updateBlog, getAblog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog } = require("../controller/blogController");
const router = express.Router();

router.post('/create', authMiddleware,isAdmin,createBlog)
router.put('/update/:id',authMiddleware,isAdmin, updateBlog)
router.get('/get/:id',getAblog)
router.get('/getblogs', getAllBlogs)
router.delete('/delete/:id', authMiddleware,isAdmin,deleteBlog)
router.put('/likes', authMiddleware,isAdmin, likeBlog)
router.put('/dislike',authMiddleware, dislikeBlog)

module.exports=router;