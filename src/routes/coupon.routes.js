import { Router } from "express"
import { protect} from "../middlewares/auth.middleware.js"
import {isAdmin} from "../middlewares/admin.middleware.js"
import { createCoupon, getAllCoupons, deleteCoupon, applyCoupon } from "../controllers/couponController.js"

const router = Router();

// Admin routes
router.post("/", protect, isAdmin, createCoupon);
router.get("/", protect, isAdmin, getAllCoupons);
router.delete("/:id", protect, isAdmin, deleteCoupon);
// User route
router.post("/apply", protect, applyCoupon);

export default router;