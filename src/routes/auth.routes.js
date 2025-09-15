import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.middleware.js";
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: "uploads/"});

router.post("/register",
  upload.fields([
    {name: "avatar", maxCount: 1},
    {name: "coverImage", maxCount: 1}
  ]),
  registerUser);

router.post("/login", loginUser);

// Protected route example
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "This is a protected route",
    user: req.user,
  });
});

export default router;
