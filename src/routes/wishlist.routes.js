import { Router } from "express";
import {protect} from "../middlewares/auth.middleware.js";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controllers/wishlistController.js";

const router = Router();

router.post("/add/:productId", protect, addToWishlist);
router.delete("/remove/:productId", protect, removeFromWishlist);
router.get("/", protect, getWishlist);

export default router;