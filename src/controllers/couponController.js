import Coupon from "../models/coupons.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/apiResponse.js";

// create coupon
const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountType, discountValue, minOrderValue, expiryDate } =
    req.body;

  const existing = await Coupon.findOne({ code });
  if (existing) throw new ApiError(400, "Coupon code already exists");

  const coupon = await Coupon.create({
    code,
    discountType,
    discountValue,
    minOrderValue,
    expiryDate,
  });

  res
    .status(201)
    .json(new ApiResponse(201, coupon, "Coupon is created successfully"));
});

// Admin - Get All Coupons
const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  if (!coupons) throw new ApiError(404, "Coupons not existed");

  res
    .status(200)
    .json(new ApiResponse(200, coupons, "Coupons fetched successfully"));
});

// Admin - Delete Coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });

  res
    .status(201)
    .json(new ApiResponse(201, {}, "Coupon is deleted successfully"));
});

// User - Apply Coupon
const applyCoupon = asyncHandler(async (req, res) => {
  const { code, orderValue } = req.body;
  console.log("code and ordervalue", orderValue)

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });
  if (!coupon) throw new ApiError(404, "Invalid coupon");

  if (new Date() > coupon.expiryDate) throw new ApiError(400, "Coupon expired");
  if (orderValue < coupon.minOrderValue)
    throw new ApiError(
      400,
      `Minimum order value must be ${coupon.minOrderValue}`
    );

  // Calculate discount
  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = (coupon.discountValue / 100) * orderValue;
  } else {
    discount = coupon.discountValue;
  }

  const finalAmount = Math.max(orderValue - discount, 0);

  res.status(200).json(
    new ApiResponse(200, {
      discount,
      finalAmount,
      message: `Coupon applied successfully! You saved $${discount.toFixed(2)}`,
    })
  );
});

export { createCoupon, getAllCoupons, deleteCoupon, applyCoupon };