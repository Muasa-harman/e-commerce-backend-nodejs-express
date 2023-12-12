const Brand = require('../models/Brand')
const asyncHandler = require("express-async-handler");
const validateMongoDb = require("../utils/validateMongoDb");

const createBrand = asyncHandler(async (req, res, next) => {
  try {
    const newBrand = await Brand.create(req.body);
    res
      .status(201)
      .json({ message: "successfully created brand", newBrand });
  } catch (error) {
    next(error);
  }
});
const updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDb(id);
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "successfully updated brand", updatedBrand });
  } catch (error) {
    next(error);
  }
});
// deeteCategory
const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    validateMongoDb(id);
    const deletedBrand = await BlogCat.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "successfully deleted brand", deletedBrand });
  } catch (error) {
    next(error);
  }
});
// getCategory
const getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDb(id);
  try {
    const getBrand = await Brand.findById(id);
    res.status(200).json({ getBrand });
  } catch (error) {
    next(error);
  }
});
// getAllCategories
const getAllBrand = asyncHandler(async (req, res, next) => {
  try {
    const getAllBrands = await Brand.find(req.body);
    res.status(200).json({ getAllBrands });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getAllBrand,
};
