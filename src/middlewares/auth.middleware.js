import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header or cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, "Not authorized, token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded._id).select("-password");
    if (!req.user) {
      throw new ApiError(401, "User not found with this token");
    }

    next();
  } catch (error) {
    throw new ApiError(401, "Not authorized, invalid token");
  }
});
