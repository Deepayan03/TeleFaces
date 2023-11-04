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
controller.post("/register",upload.single("avatar"), register);
controller.post("/login", login);
controller.get("/logout", logout);
controller.get("/getProfile/", isLoggedIn, getProfile);
controller.post("/forgotPassword", forgotPassword);
controller.post("/resetPassword/:resetToken", resetPassword);
controller.post("/changePassword", isLoggedIn, changePassword);
controller.put("/update", isLoggedIn,upload.single("avatar"),  updateUser);
export default userRouter;
