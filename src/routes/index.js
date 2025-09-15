import express from "express";
import { home } from "../controllers/homeController.js";
import authRoutes from "./auth.routes.js";
import protectedRoutes from "./auth.routes.js";
import productsRoutes from "./productsRoutes.js";
import cartRoutes from "./cart.routes.js";

const router = express.Router();

router.get("/", home);
router.use("/auth", protectedRoutes);  // ✅ now protected
router.use("/products", productsRoutes);
router.use("/cart", cartRoutes);
export default router;
