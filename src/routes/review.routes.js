import { Router } from "express";
import { addReview, getReviews, deleteReview } from "../controllers/reviewController.js";
import { protect } from "../middlewares/auth.middleware.js"

const router = Router();

router.post("/:productId", protect, addReview);
router.get("/:productId", getReviews);
router.delete("/:productId/:reviewId", protect, deleteReview);

export default router;