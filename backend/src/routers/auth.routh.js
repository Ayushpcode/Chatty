import express from "express";
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);  // Fixed the typo here

export default router;
