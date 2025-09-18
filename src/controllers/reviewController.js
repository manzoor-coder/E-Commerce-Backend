import Product from "../models/products.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const addReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.productId;
    const userId = req.user._id;

    const product = await Product.findById(productId);

    if (!product) throw new ApiError(404, "Product not found");

    const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === userId.toString()
    );

    if (alreadyReviewed) throw new ApiError(400, "Product already reviewed by the user");

    // Add review
    const review = {
        user: userId,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    product.reviews.push(review)

    // Update rating
    product.numReviews = product.reviews.length;
    product.averageRating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

    await product.save();

    res
        .status(201)
        .json(new ApiResponse(201, product, "Review added successfully"));
});

// 📜 Get Reviews of a product
const getReviews = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId).populate(
        "reviews.user",
        "name email"
    );

    if (!product) throw new ApiError(404, "Product not found");

    res.status(200).json(
        new ApiResponse(200, product.reviews, "Reviews fetched successfully")
    );
});

// ❌ Delete Review (admin or user who created it)
const deleteReview = asyncHandler(async (req, res) => {
    const { productId, reviewId } = req.params;
    const userId = req.user._id;
  
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");
  
    const review = product.reviews.find((r) => r._id.toString() === reviewId);
    if (!review) throw new ApiError(404, "Review not found");
  
    // Allow only admin or review owner
    if (review.user.toString() !== userId.toString() && req.user.role !== "admin") {
      throw new ApiError(403, "Not authorized to delete this review");
    }
  
    product.reviews = product.reviews.filter((r) => r._id.toString() !== reviewId);
  
    // Recalculate rating
    product.numReviews = product.reviews.length;
    product.averageRating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length
        : 0;
  
    await product.save();

    res
    .status(200)
    .json(new ApiResponse(200, product, "Review removed successfully"));
});

export { addReview, getReviews, deleteReview };