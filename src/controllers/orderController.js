import { asyncHandler } from "../utils/asyncHandler.js";
import Order from "../models/order.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js"

// Create new order
const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

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

// ✅ Get single order by ID
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("user", "name email")
        .populate("orderItems.product", "name price");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
});

// ✅ Get logged in user's orders
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(new ApiResponse(200, orders, "User orders fetched successfully"));
});

// ✅ Admin: Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate("user", "name email")
        .populate("orderItems.product", "name price");

    res.status(200).json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

// ✅ Update order to paid
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.status(200).json(new ApiResponse(200, updatedOrder, "Order marked as paid"));
});

// ✅ Update order to delivered (Admin only)
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.status(200).json(new ApiResponse(200, updatedOrder, "Order marked as delivered"));
});


export { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderToPaid, updateOrderToDelivered }