import { Router } from "express";
import { createProduct, getAllProducts, updateProduct, getProductById, deleteProduct } from "../controllers/productController.js";
import multer from "multer";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();
const upload = multer({ dest: "uploads/"});

router.post("/", protect, upload.fields([{name: "images", maxCount: 10}]), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", protect, upload.fields([{name: "images", maxCount: 10}]), updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;