import { Router } from "express";
import { addToCart, getCart, updateCart, removeFromCart } from "../controllers/cartController.js";
import { protect } from "../middlewares/auth.middleware.js";


const router = Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.put("/update", protect, updateCart);
router.delete("/remove/:id", protect, removeFromCart);

export default router;