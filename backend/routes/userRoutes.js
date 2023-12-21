import { Router } from "express";
import isLoggedIn from "../middlewares/authorization.js";
import upload from "../middlewares/multerMiddleware.js";
import Users from "../controllers/userControllers.js";
const userRouter = Router();
const userControllers = new Users();
// Defining user routes
userRouter.post("/register", upload.single("avatar"), userControllers.register);
userRouter.post("/login", userControllers.login);
userRouter.get("/logout", userControllers.logout);
userRouter.get("/getProfile/:userId", isLoggedIn, userControllers.getProfile);
userRouter.post("/forgotPassword", userControllers.forgotPassword);
userRouter.post("/resetPassword/:resetToken", userControllers.resetPassword);
userRouter.post("/changePassword", isLoggedIn, userControllers.changePassword);
userRouter.put(
  "/update",
  isLoggedIn,
  upload.single("avatar"),
  userControllers.updateUser
);
export default userRouter;
