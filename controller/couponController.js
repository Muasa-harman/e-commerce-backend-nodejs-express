const Coupon = require("../models/Coupon");
const validateMongoDbId = require("../utils/validateMongoDb");
const asyncHandler = require("express-async-handler");


const createCoupon = asyncHandler(async(req,res,next)=>{
    try {
       const newCoupon = await Coupon.create(req.body);
       res.status(201).json({message: "successfully created a new coupon", newCoupon}) 
    } catch (error) {
        next(error);
    }
});
const getAllCoupons = asyncHandler(async(req,res,next)=>{
    try {
       const coupons = await Coupon.find(req.body);
       res.status(200).json({coupons}) 
    } catch (error) {
        next(error);
    }
});
const updateCoupon = asyncHandler(async(req,res,next)=>{
    const{ id} = req.params;
    validateMongoDbId(id)
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {new: true },);
        res.status(200).json({message: "successfully updated coupon",updatedCoupon})
    } catch (error) {
        next(error);
    }
});
const deleteCoupon = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        res.status(204).json("successfully deleted coupon");
    } catch (error) {
        
    }
})

module.exports = {createCoupon,getAllCoupons,updateCoupon,deleteCoupon}