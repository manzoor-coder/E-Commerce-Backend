import { asyncHandler } from "../utils/asyncHandler.js";
import Order from "../models/order.models.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/apiResponse.js"

// Create new order
const createOrder = asyncHandler(async (req, res) => {
    const {orderItems, shippingAddress, paymentMethod, totalAmount} = req.body;

    if (!orderItems || orderItems.length === 0) {
        throw new ApiError(400, "No order items");
    }

    const order = new Order({
        user: req.user?._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalAmount
    });

    const createdOrder = await order.save();
    res
    .status(201)
    .json(new ApiResponse(
        201,
        createdOrder,
        "Order created successfully"
    ));
});

// Get loggein user's orders
const getUsersOrder = asyncHandler(async (req, res) => {
    const user = req.user?._id;
    const orders = await Order.find({user});

    res
    .status(201)
    .json(new ApiResponse(201, orders, "User's Orders fetched successfully"));
});

// Get orders by ID
const getOrderById = asyncHandler(async (req, res) => {
    const ID = req.params.id;
    const order = await Order.findById(ID).populate("user", "name email");

    if(!order) {
        throw new ApiError(400, "Order not found")
    }

    res
    .status(201)
    .json(new ApiResponse(201, order, "Order futched by id successfully"));
});

// Admin: Update order status
const updateOrderStatus = asyncHandler( async (req, res) => {
    // console.log("order id", req.body);
    const order = await Order.findById(req.params.id);

    if(!order) {
        throw new ApiError(400, "Order not found");
    }


    // Only update if delivered status changes
  if (typeof isDelivered !== "undefined") {
    order.isDelivered = isDelivered;

    if (isDelivered) {
      order.deliveredAt = Date.now(); // 👈 current date-time set hoga
    } else {
      order.deliveredAt = null; // 👈 agar false bhejo to clear ho jayega
    }
  }


    const updatedOrder = await order.save();
    res
    .status(201)
    .json(new ApiResponse(201, updatedOrder, "Order is updated successfully"));
});

export {createOrder, getUsersOrder, getOrderById, updateOrderStatus}