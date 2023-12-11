const User = require('../models/User')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const authMiddleware = asyncHandler(async(req,res,next)=>{
    try {
        let token;
        if(req?.headers?.authorization?.startsWith('Bearer')){
              token = req.headers.authorization.split(" ")[1];
            }else{
                throw new Error('There is no token attached to the header');
            }
            try {
                if(token) {
                    const decoded = jwt.verify(token, process.env.JWT);
                    const user = await User.findById(decoded?.id);
                    req.User = user;
                    // req.User = decoded;
                    next();
                }
            } catch (error) {
                throw new Error('Not Authorized token expired please login again')
            }
                
            } catch (error) {
                next(error);
            }
});

const isAdmin = asyncHandler(async(req,res, next)=>{
    try {
        const {email} = req.User;
        const adminUser = await User.findOne({email:email});
        if(adminUser.role !== 'admin'){
            throw new Error('You are not an admin')
        } else{
            next();
        }
        
    } catch (error) {
        next(error);
    }
});

module.exports = {authMiddleware,isAdmin};