import express from "express";
import { getUserProfile, updatePassword } from "../controllers/userController";
import { verifyToken } from "../utils/verifyToken";
const router = express.Router();

// Route to get user profile
router.get("/profile", verifyToken, getUserProfile);
//Route to update password
router.put("/update-password", verifyToken, updatePassword);

export default router;
