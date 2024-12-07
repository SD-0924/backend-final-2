
// import express from "express";
import { Router } from "express";
import { getCheckoutInfo,
   updateUserAddress,
   checkoutHandler,
   orderDetails,
   orderHistory, } from "../controllers/checkoutController";
import { verifyToken } from "../utils/verifyToken";

const router = Router();

// New route for getting checkout info
router.get("/checkout-info",verifyToken, getCheckoutInfo);

router.put("/update-address",verifyToken, updateUserAddress);

// export const checkoutRoutes = express.Router();

router.post("/checkout-payment", checkoutHandler);
router.get("/checkout-order-history", orderHistory);
router.get("/checkout-order-details/:order_id", orderDetails);

export default router;




