import Wishlist from "../models/wishlist.models.js";
import Product from "../models/products.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// ➕ Add to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = new Wishlist({ user: userId, products: [] });
  }

  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  res.status(200).json(new ApiResponse(200, wishlist, "Product added to wishlist"));
});

// ➖ Remove from wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) throw new ApiError(404, "Wishlist not found");

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId
  );
  await wishlist.save();

  res.status(200).json(new ApiResponse(200, wishlist, "Product removed from wishlist"));
});

// 📜 Get wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const wishlist = await Wishlist.findOne({ user: userId }).populate("products");

  if (!wishlist) throw new ApiError(404, "Wishlist not found");

  res.status(200).json(new ApiResponse(200, wishlist, "Wishlist fetched"));
});

export { addToWishlist, removeFromWishlist, getWishlist };
