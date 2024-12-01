import { Router } from "express";
import { signUp, login } from "../controllers/authController";


const router = Router();

// Route for user signup
// POST /api/auth/signup
// This route validates the request data and then creates a new user.
router.post("/signup", signUp);

// Route for user signin
// POST /api/auth/signin
// This route validates the request data and then authenticates the user.
router.post("/login", login);

export default router;
