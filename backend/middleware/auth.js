import User from "../models/userModel.js";
import ErrorHander from "../utils/errorhander.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {

  const token = req.cookies.token;
  // console.log("get: ",token);

  if (!token) {
    return next(new ErrorHander("Please login to access this resources", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);

  next();
});

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resources`,
          403
        )
      );
    }
    next();
  };
};
