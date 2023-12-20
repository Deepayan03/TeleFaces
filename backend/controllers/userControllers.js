import cloudinary, { v2 as cdnary } from "cloudinary";
import AppError from "../utils/ErrorUtil.js";
import fs from "fs";
import sendEmail from "../utils/sendEmail.js";
import { mongoose, User } from "../models/userModel.js";
const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};

const register = async (req, res, next) => {
  const creationSession = await mongoose.startSession();
  creationSession.startTransaction();
  try {
    // Destructure user information from the request body
    const { userName, email, password, confirmPassword } = req.body;

    // Check if all required fields are present
    if (!userName || !email || !password || !confirmPassword) {
      return next(new AppError("All fields are mandatory", 400));
    }

    // Check if the email already exists in the database
    const userEmail = await User.findOne({ email }).session(creationSession);
    if (userEmail) {
      return next(new AppError("Email already exists", 400));
    }

    // Check if the provided password and confirmPassword match
    if (password !== confirmPassword) {
      return next(
        new AppError("Password and confirm password don't match", 400)
      );
    }
    // Create a new user in the database
    const user = new User({
      userName,
      email,
      password,
      avatar: {
        public_id: email, // Set the public_id to the user's email
        secure_url: "https://picsum.photos/200/300?grayscale", // Default URL for the avatar
      },
    });
    // Check if user creation was successful
    if (!user) {
      return next(new AppError("User creation unsuccessful", 400));
    }

    // Handle avatar upload using Cloudinary if a file is present in the request
    if (req.file) {
      try {
        // Configure Cloudinary with API key, secret, and cloud name
        cloudinary.config({
          cloud_name: process.env.cloudinary_cloudName,
          api_key: process.env.cloudinary_apiKey,
          api_secret: process.env.cloudinary_secret,
        });

        // Upload the file to Cloudinary
        const result = await cdnary.uploader.upload(req.file.path, {
          folder: "Telefaces",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });

        // If upload is successful, update user's avatar information
        if (result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;

          // Remove the file from the local filesystem
          fs.rm(req.file.path, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      } catch (error) {
        // Handle errors during Cloudinary upload
        fs.rm(req.file.path, (err) => {
          if (err) {
            console.error(err);
          }
        });
        console.log(error);
        return next(new AppError(error.message, 400));
      }
    }
    // Save the user to the database
    await user.save({ session: creationSession });
    // Remove sensitive information from the user object
    user.password = undefined;

    // Generate a JWT token and set it in a cookie
    const token = await user.generateJWTToken();
    res.cookie("token", token, cookieOptions);
    await creationSession.commitTransaction();
    creationSession.endSession();
    // Return a success response with user information
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    // Handle errors during the registration process
    console.log(error);
    await creationSession.abortTransaction();
    creationSession.endSession();
    return next(new AppError(error.message, 400));
  }
};

const login = async (req, res, next) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  try {
    // Find a user in the database based on the provided email
    const user = await User.findOne({ email }).select("+password");

    // If no user is found, return an error
    if (!user) {
      return next(new AppError("Email not registered", 404));
    }

    // Check if the provided password matches the stored hashed password
    if (!user.confirmPassword(password)) {
      return next(new AppError("Incorrect username or password"));
    }

    // Generate a JWT token for authentication
    const token = await user.generateJWTToken();

    // Set the token in a cookie for subsequent requests
    res.cookie("token", token, cookieOptions);

    // Remove the password field from the user object
    user.password = undefined;

    // Return a success response with user information
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    // Handle errors during the login process
    console.log(error);
    return next(new AppError(error.message, 500));
  }
};

const logout = async (req, res, next) => {
  // Clear the 'token' cookie by setting it to null
  res.cookie("token", null, {
    secure: true, // Secure flag ensures the cookie is sent only over HTTPS
    maxAge: 0, // Set the maximum age of the cookie to 0 to expire it immediately
    httpOnly: true, // httpOnly flag restricts access to the cookie from client-side JavaScript
  });

  // Return a success response indicating successful logout
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

const getProfile = async (req, res, next) => {
  // Extract the userId from the request parameters
  const { userId } = req.params;

  try {
    // Find a user in the database based on the provided userId
    const user = await User.findById(userId);

    // If no user is found, return an error
    if (!user) {
      return next(new AppError("User doesn't exist", 404));
    }

    // Return a success response with the user information
    res.status(200).json({
      success: true,
      message: "User Found!!!",
      data: user,
    });
  } catch (error) {
    // Handle errors during the profile retrieval process
    console.log(error);
    return next(new AppError(error.message, 500));
  }
};

const forgotPassword = async (req, res, next) => {
  // Start a mongoose session for the transaction
  const resetSession = await mongoose.startSession();
  resetSession.startTransaction();
  try {
    const { email } = req.body;
    // Use the session for the query
    const user = await User.findOne({ email }).session(resetSession);
    if (!user) {
      // Handle case where the user is not found with a 404 status
      return next(new AppError("Email not found", 404));
    }

    const resetToken = await user.generatePasswordResetToken();
    // Save user changes within the transaction
    await user.save({ session: resetSession });
    const subject = "Reset password";
    const url = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;
    const message = `You can reset your password by clicking <a href=${url} target="_blank">Reset your password</a> \n If the above link does not work for some reason then copy paste this link in new tab${url}.\n If you have not requested this, kindly ignore.`;
    // Send email with the reset link
    await sendEmail(email, subject, message);
    // Commit the transaction if successful
    await resetSession.commitTransaction();
    resetSession.endSession();
    res.status(200).json({
      success: true,
      message: "Reset password link has been sent to your email successfully",
    });
  } catch (error) {
    console.log(error);
    // Abort the transaction and handle errors with a 500 status
    await resetSession.abortTransaction();
    resetSession.endSession();
    return next(new AppError(error.message, 500));
  }
};

const resetPassword = async (req, res, next) => {
  const resetSession = await mongoose.startSession();
  resetSession.startTransaction();
  try {
    const { resetToken } = req.params;
    const { password } = req.body;
    const forgotPasswordToken = await crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const checkToken = await User.findOne({
      forgotPasswordToken,
      // Check if the reset token is not expired
      forgotPasswordExpiry: { $gt: Date.now() },
    }).session(resetSession);
    if (!checkToken) {
      // Handle invalid or expired token with a 400 status
      return next(new AppError("Invalid or Expired Token", 400));
    }
    checkToken.password = password;
    checkToken.forgotPasswordExpiry = undefined;
    checkToken.forgotPasswordToken = undefined;
    // Save changes within the transaction
    await checkToken.save({ session: resetSession });
    await resetSession.commitTransaction();
    resetSession.endSession();
    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    // Abort the transaction and handle errors with a 401 status
    await resetSession.abortTransaction();
    resetSession.endSession();
    return next(new AppError(error.message, 401));
  }
};

const changePassword = async (req, res, next) => {
  // Start a transaction session
  const changePasswordSession = await mongoose.startTransaction();
  try {
    const { userId } = req.params;
    const { newPassword, confirmPassword, oldPassword } = req.body;
    if (!newPassword || !confirmPassword || !oldPassword) {
      // Handle missing fields with a 400 status
      return next(new AppError("All fields are mandatory", 400));
    }
    if (newPassword !== confirmPassword) {
      // Handle password mismatch with a 400 status
      return next(
        new AppError("Password and confirm password don't match", 400)
      );
    }
    if (oldPassword === newPassword) {
      // Handle old and new password being the same with a 400 status
      return next(new AppError("Old and New password cannot be the same", 400));
    }
    const user = await User.findById(userId)
      .select("+password")
      .session(changePasswordSession);
    if (!user) {
      // Handle non-existent user with a 404 status
      return next(new AppError("User doesn't exist", 404));
    }
    const isPasswordValid = await user.confirmPassword(oldPassword);
    if (!isPasswordValid) {
      // Handle incorrect old password with a 400 status
      return next(new AppError("Incorrect old password", 400));
    }
    user.password = newPassword;
    // Save changes within the transaction
    await user.save({ session: changePasswordSession });
    await changePasswordSession.commitTransaction();
    changePasswordSession.endSession();
    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    // Abort the transaction and handle errors with a 401 status
    await changePasswordSession.abortTransaction();
    changePasswordSession.endSession();
    return next(new AppError(error.message, 401));
  }
};

const updateUser = async (req, res, next) => {
  const { fullName, userId } = req.body;
  // Start a transaction session
  const updateUserSession = await mongoose.startTransaction();
  const user = await User.findById(userId).session(updateUserSession);
  if (!user) {
    // Handle invalid user ID with a 404 status
    return next(new AppError("Invalid user ID", 404));
  }
  if (fullName) {
    user.userName = fullName;
  }
  if (req.file) {
    try {
      // Configure Cloudinary with API key, secret, and cloud name
      cloudinary.config({
        cloud_name: process.env.cloudinary_cloudName,
        api_key: process.env.cloudinary_apiKey,
        api_secret: process.env.cloudinary_secret,
      });
      // Destroy the previous avatar in Cloudinary
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      // Upload the new file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Telefaces",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });
      // If upload is successful, update user's avatar information in the database
      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // Remove the file from the local filesystem
        fs.rm(req.file.path, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      // Save changes within the transaction
      await user.save({ session: updateUserSession });
      await updateUserSession.commitTransaction();
      updateUserSession.endSession();
    } catch (error) {
      // Handle errors during Cloudinary upload
      fs.rm(req.file.path, (err) => {
        if (err) {
          console.error(err);
        }
      });
      updateUserSession.abortTransaction();
      updateUserSession.endSession();
      console.log(error);
      // Handle errors with a 400 status
      return next(new AppError(error.message, 400));
    }
  }
  res.status(200).json({
    message: "User updation successful",
    data: user,
  });
};
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
