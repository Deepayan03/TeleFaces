import User from "../models/userModel.js";
import cloudinary,{ v2 as cdnary } from "cloudinary";
import AppError from "../utils/ErrorUtil.js";
import fs from "fs";
const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};
const register = async (req, res, next) => {
  try {
    console.log(req.body);
    const { userName, email, password, confirmPassword } = req.body;
    if (!userName || !email || !password || !confirmPassword) {
      return next(new AppError("All fields are mandatory", 400));
    }
    const userEmail = await User.findOne({email});
    if (userEmail) {
      return next(new AppError("Email already exists", 400));
    }
    if (password !== confirmPassword) {
      return next(
        new AppError("Password and confirm password doesn't match", 400)
      );
    }
    const user = await User.create({
      userName,
      email,
      password,
      avatar: {
        public_id: email, // Set the public_id to the user's email
        secure_url: "https://picsum.photos/200/300?grayscale", // Default URL for the avatar
      },
    });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User registration unsuccessful!",
      });
    }

    if (req.file) {
      try {
        cloudinary.config({
          cloud_name: 'dnymefrvq',
          api_key: '727854313476688',
          api_secret: process.env.cloudinary_secret,
        });
        const result = await cdnary.uploader.upload(req.file.path, {
          folder: "Telefaces",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });
        console.log(result);
        if (result) {
           user.avatar.public_id = result.public_id;
           user.avatar.secure_url = result.secure_url;
           fs.rm(req.file.path, (err) => {
            if (err) {
              console.error(err);
            }
          });
          
        }
      } catch (error) {
        fs.rm(req.file.path, (err) => {
          if (err) {
            console.error(err);
          }
        });        
        console.log(error);
        return next(new AppError(error.message, 400));
      }
    }

    await user.save();
    user.password=undefined;
    const token = user.generateJWTToken();
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.log("all over error")
    console.log(error);
    return next(new AppError("registration failed", 400));
  }
};
const login = async (req, res, next) => {};
const logout = async (req, res, next) => {};
const getProfile = async (req, res, next) => {};
const forgotPassword = async (req, res, next) => {};
const resetPassword = async (req, res, next) => {};
const changePassword = async (req, res, next) => {};
const updateUser = async (req, res, next) => {};

export {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser,
};
