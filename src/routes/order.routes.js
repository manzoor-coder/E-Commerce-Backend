import { Router } from "express";
import {protect} from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import {createOrder, getUsersOrder, getOrderById, updateOrderStatus} from "../controllers/orderController.js"

const router = Router();

// place new order
router.post("/", protect, createOrder);

// get logged-in user's orders
router.get("/myorders", protect, getUsersOrder);

// get order by ID
router.get("/:id", protect, getOrderById);

// Admin: Update the status of order (Delivered, Cancelled etc)
router.put("/:id/status", protect, isAdmin, updateOrderStatus);

export default router;