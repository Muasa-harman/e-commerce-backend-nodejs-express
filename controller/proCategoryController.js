const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");
const validateMongoDb = require("../utils/validateMongoDb");

const createCategory = asyncHandler(async (req, res, next) => {
  try {
    const newCategory = await Category.create(req.body);
    res
      .status(201)
      .json({ message: "successfully created category", newCategory });
  } catch (error) {
    next(error);
  }
});
const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDb(id);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "successfully updated category", updatedCategory });
  } catch (error) {
    next(error);
  }
});
// deeteCategory
const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    validateMongoDb(id);
    const deletedCategory = await Category.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "successfully deleted category", deletedCategory });
  } catch (error) {
    next(error);
  }
});
// getCategory
const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDb(id);
  try {
    const getCategory = await Category.findById(id);
    res.status(200).json({ getCategory });
  } catch (error) {
    next(error);
  }
});
// getAllCategories
const getAllCategories = asyncHandler(async (req, res, next) => {
  try {
    const getAllCategories = await Category.find(req.body);
    res.status(200).json({ getAllCategories });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
};
