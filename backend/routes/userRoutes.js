import { Router } from "express";
import isLoggedIn from "../middlewares/authorization.js";
import {
  changePassword,
  forgotPassword,
  getProfile,
  login,
  logout,
  register,
  resetPassword,
  updateUser,
} from "../controllers/userControllers.js";
import upload from "../middlewares/multerMiddleware.js";

const userRouter = Router();
// Defining user routes
userRouter.post("/register",upload.single("avatar") , register);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.get("/getProfile/", isLoggedIn, getProfile);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.post("/resetPassword/:resetToken", resetPassword);
userRouter.post("/changePassword", isLoggedIn, changePassword);
userRouter.put("/update", isLoggedIn,upload.single("avatar"),  updateUser);
export default userRouter;
