const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");
const validateMongoDb = require("../utils/validateMongoDb");

const createCategory = asyncHandler(async(req,res,next)=>{
    try {
        const newCategory = await Category.create(req.body);
        res.status(201).json({message: "successfully created category", newCategory})
    } catch (error) {
        next(error);
    }
})


module.exports = {createCategory}