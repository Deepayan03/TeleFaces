import AppError from "../utils/ErrorUtil.js";
import jwt from "jsonwebtoken";
const isLoggedIn = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new AppError("Unauthenticated", 400));
  }
  try {
    const userData = await jwt.verify(token, process.env.SECRET);
    req.user = userData;
    next();
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

export default isLoggedIn;
