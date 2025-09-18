import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
  } from "../controllers/authController.js";
  import {getAllOrders, getOrderById, updateOrderToDelivered,} from "../controllers/orderController.js"
  import {protect} from '../middlewares/auth.middleware.js'
  import {isAdmin} from '../middlewares/admin.middleware.js'

  const router = Router();

  // 👑 Admin-only routes
router.get("/orders", protect, isAdmin, getAllOrders)
router.get("/orders/:id", protect, isAdmin, getOrderById);
router.put("/orders/:id/deliver", protect, isAdmin, updateOrderToDelivered);

router.get("/users", protect, isAdmin, getAllUsers);
router.get("/users/:id", protect, isAdmin, getUserById);
router.put("/users/:id", protect, isAdmin, updateUser);
router.delete("/users/:id", protect, isAdmin, deleteUser);

export default router;