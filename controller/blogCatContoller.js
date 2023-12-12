const BlogCat = require('../models/BlogCat')
const asyncHandler = require("express-async-handler");
const validateMongoDb = require("../utils/validateMongoDb");

const createbCategory = asyncHandler(async (req, res, next) => {
  try {
    const newbCategory = await BlogCat.create(req.body);
    res
      .status(201)
      .json({ message: "successfully created bcategory", newbCategory });
  } catch (error) {
    next(error);
  }
});
const updateBcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDb(id);
  try {
    const updatedBcategory = await BlogCat.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "successfully updated category", updatedBcategory });
  } catch (error) {
    next(error);
  }
});
// deeteCategory
const deleteBcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    validateMongoDb(id);
    const deletedBcategory = await BlogCat.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "successfully deleted category", deletedBcategory });
  } catch (error) {
    next(error);
  }
});
// getCategory
const getBcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDb(id);
  try {
    const getBCategory = await BlogCat.findById(id);
    res.status(200).json({ getBCategory });
  } catch (error) {
    next(error);
  }
});
// getAllCategories
const getAllBcategories = asyncHandler(async (req, res, next) => {
  try {
    const getAllBCategories = await BlogCat.find(req.body);
    res.status(200).json({ getAllBCategories });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createbCategory,
  updateBcategory,
  deleteBcategory,
  getBcategory,
  getAllBcategories,
};
