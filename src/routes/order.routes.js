import { Router } from "express";
import {protect} from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import {createOrder, getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,} from "../controllers/orderController.js"

const router = Router();

// place new order
router.post("/", protect, createOrder);

// get logged-in user's orders
router.get("/myorders", protect, getMyOrders);

router.get("/", protect, isAdmin, getAllOrders);

// get order by ID
router.get("/:id", protect, getOrderById);

router.put("/:id/pay", protect, updateOrderToPaid);

// Admin: Update the status of order (Delivered, Cancelled etc)
router.put("/:id/deliver", protect, isAdmin, updateOrderToDelivered);

export default router;