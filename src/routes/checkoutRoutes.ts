import { Router } from "express";
import { getCheckoutInfo, updateUserAddress } from "../controllers/checkoutController";
import { verifyToken } from "../utils/verifyToken";

const router = Router();

// New route for getting checkout info
router.get("/checkout-info",verifyToken, getCheckoutInfo);

router.put("/update-address",verifyToken, updateUserAddress);

export default router;
