
import { ApiError } from "../utils/ApiError.js";

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Admin hai to allow karo
  } else {
    throw new ApiError(403, "Not authorized as admin");
  }
};
