const User = require('../models/User');
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

//create ptoduct
const createProduct = asyncHandler(async (req, res, next) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res
      .status(201)
      .json({ message: "successfully created a new product", newProduct });
  } catch (error) {
    next(error);
  }
});

// update product
const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(201)
      .json({ message: "successfully updated product", updateProduct });
  } catch (error) {
    next(error);
  }
});

// delete product
const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    res
      .status(201)
      .json({ message: "product deleted successfully", deleteProduct });
  } catch (error) {
    next(error);
  }
});
//fetch a products
const getaProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findOne({ _id: id });
    if (!findProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ findProduct });
  } catch (error) {
    next(error);
  }
});

// fetch products
const getAllProducts = asyncHandler(async (req, res, next) => {
  try {
    //filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("this does not eist");
    }
    // console.log(page,limit,skip);

    const product = await query.exec();
    res.json({ product });
  } catch (error) {
    next(error);
  }
});
// add to wishlist
const addToWishList = asyncHandler(async(req,res,next)=>{
  const {_id} = req.User;
  const {prodId} = req.body;
  try {
    const user =  await User.findById(_id);
    const alreadyAdded = user.wishlist.find((id)=>id.toString()=== prodId);
    if(alreadyAdded){
      let user = await User.findByIdAndUpdate(_id,{
        $pull: {wishlist: prodId},

      },{new: true});
      res.json({user});
    } else {
      let user = await User.findByIdAndUpdate(_id,{
        $push: {wishlist: prodId},

      },{new: true});
      res.json({user});
    }
  } catch (error) {
    next(error);
  }
});
// rating
const rating = asyncHandler(async(req,res,next)=>{
  const { _id } = req.User;
  const {star,prodId } = req.body;
  try {
    const product = await Product.findById(prodId);
    if (!product) {
      // Handle the case where the product is not found
       res.status(404).json({ error: 'Product not found' });
    }
    
    if (!product.ratings || !Array.isArray(product.ratings)) {
      // Handle the case where ratings is not an array or undefined
      return res.status(400).json({ error: 'Invalid ratings array' });
    }

    let alreadyRated = product.ratings.find((userId)=>userId && userId.postedby.toString() === _id.toString());
    
    if(alreadyRated){
      const updateRating = await Product.updateOne(
        {
        "ratings.postedby":_id,
      },
         {
          $set:{"ratings.$.star":star}
        },{new : true}
      );
      res.status(200).json(updateRating);
    } else{
      const rateProduct = await Product.findByIdAndUpdate(prodId,{
        $push:{
          ratings: {
            star: star,
            postedby: _id,
          },
        },
      },{new: true});
      res.json({rateProduct});
    }
  } catch (error) {
    next(error);
  }
})

module.exports = {
  createProduct,
  getaProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating
};
