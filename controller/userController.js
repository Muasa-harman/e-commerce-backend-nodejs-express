const { generateToken } = require("../config/jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDb");
const generateRefreshToken = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailController");
const CryptoJS = require("crypto-js");

const createUser = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  try {
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      //create new user
      const newUser = await User.create(req.body);
      res
        .status(201)
        .json({ message: "successfully created an account", newUser });
    } else {
      throw new Error("User already Exist");
    }
  } catch (error) {
    next(error);
  }
});
//login user
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //check if user existuser.passwordResetToken = undefined
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateuser = await User.findByIdAndUpdate(
        findUser?.id,
        { refreshToken: refreshToken },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 22 * 60 * 60 * 1000,
      });
      res.status(200).json({
        message: "successfully logged in",
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser?._id),
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    next(error);
  }
});
//handle refreshtoken
const handleRefreshToken = asyncHandler(async (req, res, next) => {
  const cookie = req.cookies;
  try {
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user)
      throw Error("No refresh token present in the db or not matched!");
    jwt.verify(refreshToken, process.env.JWT, (error, decoded) => {
      if (error || user.id !== decoded.id) {
        throw new Error("there is something wrong with the refresh token ");
      }
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
  } catch (error) {
    next(error);
  }
});

// logout
const logout = asyncHandler(async (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204) //forbidden
  }
  await User.findByIdAndUpdate(user._id, { refreshToken: "" });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204).json({message: "successfully logged out"});; //no Content
});

//getAll users
const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const getUsers = await User.find();
    res.status(200).json({ getUsers });
  } catch (error) {
    next(error);
  }
});

//get a user
const getUser = asyncHandler(async (req, res, next) => {
  {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const getUser = await User.findById(id);
      res.status(200).json({ getUser });
    } catch (error) {
      next(error);
    }
  }
});
// delete a user
const deleteUser = asyncHandler(async (req, res, next) => {
  {
    const { id } = req.params;
    validateMongoDbId();
    try {
      const deleteUser = await User.findById(id);
      res
        .status(200)
        .json({ message: "successfully deleted user", deleteUser });
    } catch (error) {
      next(error);
    }
  }
});

//update a user
const updatedUser = asyncHandler(async (req, res, next) => {
  const { _id } = req.User;
  validateMongoDbId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      { new: true }
    );
    res.status(200).json({ message: "user sucessfully updated", updatedUser });
  } catch (error) {
    next(error);
  }
});

const blockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId();
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.json("User Blocked");
  } catch (error) {
    next(error);
  }
});

const unblockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId();
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    res.json("User unblocked!");
  } catch (error) {
    next(error);
  }
});

const updatePassword = asyncHandler(async (req, res, next) => {
  try {
    const { _id } = req.User;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
      user.password = password;
      const updatedPassword = await user.save();
      res.json({ message: "successfully updated password", updatedPassword });
    } else {
      res.status(400).json({ error: "Password not provided" });
    }
  } catch (error) {
    next(error);
  }
});

const forgotPasswordToken = asyncHandler(async(req,res)=>{
  const {email} = req.body;
  const user = await User.findOne({email});
  if(!user) throw Error ("No user not found with this email")
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, please follow this link to reset your password. This link is valid until 10 minutes from now.
    <a href='http://localhost:3001/api/user/reset-password/${token}'>Click here!</a>`;
    const data = {
      to: email,
      text: "Hey maluti",
      subject: "Reset Password Link",
      html:resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    next(error)
  }
});

const resetPassword = asyncHandler(async(req,res,next)=>{
  const {password} = req.body;
  const {token} = req.params;
  try {
    // Hash the token
    const hashedToken = CryptoJS.SHA256(token).toString(CryptoJS.enc.Hex);

    // Find the user by the hashed token and check the expiration
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {$gt: Date.now()},
    });
    if(!user){
      throw new Error("Token expired, Please try again later");   
    } 
 // Update the user's password and clear the reset token fields
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Save the updated user document
    await user.save();
    res.json(user);
    
  } catch (error) {
    next(error);
  }
});
module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUser,
  deleteUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  logout,
};


