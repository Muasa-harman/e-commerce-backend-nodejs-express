const Blog = require("../models/Blog");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDb");
const cloudinaryUploadingImg = require("../utils/cloudinary");
const fs = require("fs");

//create blog
const createBlog = asyncHandler(async (req, res, next) => {
  // const {id} = req.params;
  try {
    const newBlog = await Blog.create(req.body);
    res.status(201).json({ message: "successfully created blog", newBlog });
  } catch (error) {
    next(error);
  }
});

//update blog
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "successfully updated blog", updatedBlog });
  } catch (error) {}
});
// getablog
const getAblog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getAblog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes")
      .exec();
    if (!getAblog) {
      // Handle the case where the blog with the given ID is not found
      return res.status(404).json({ error: "Blog not found" });
    }
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.status(200).json({ getAblog });
  } catch (error) {
    next(error);
  }
});
// get all blogs
const getAllBlogs = asyncHandler(async (req, res, next) => {
  try {
    const allBlogs = await Blog.find(req.body);
    if (!allBlogs) {
      return res.status(404).json({ error: "There are no blogs found" });
    }
    res.status(200).json({ allBlogs });
  } catch (error) {
    next(error);
  }
});
// delete blog
const deleteBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "successfully deleted  blog", deletedBlog });
  } catch (error) {
    next(error);
  }
});
// like blog
const likeBlog = asyncHandler(async (req, res, next) => {
  const { blogId } = req?.body;
  try {
    validateMongoDbId(blogId);
    // find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    const { _id } = req.user;
    // find login User
    const loginUserId = req?.user?._id;

    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json({ blog, userWhoLiked: null });
    }
    // find if the user has liked the post
    const isLiked = blog?.isLiked;
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json({ blog, userWhoLiked: null });
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      console.log("this is the user:", req?.user);

      res.json({ blog, userWhoLiked: req?.user });
    }
  } catch (error) {
    next(error);
  }
});
// dislike blog
const dislikeBlog = asyncHandler(async (req, res, next) => {
  const { blogId } = req.body;
  try {
    validateMongoDbId(blogId);
    // find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find login User
    const loginUserId = req?.user?._id;

    // find if the user has disliked the blog
    const isDisLiked = blog?.isDisliked;
    // find if the user has disliked the blog
    const alreadyLiked = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json({ blog });
    }
    if (isDisLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json({ blog });
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      );
      res.json({ blog });
    }
  } catch (error) {
    next(error);
  }
});

const uploadImages = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const uploader = (path) => cloudinaryUploadingImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = files;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );
    res.json(findProduct);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getAblog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  dislikeBlog,
  uploadImages,
};
