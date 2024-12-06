import express from "express";
import {
  checkoutHandler,
  orderDetails,
  orderHistory,
} from "../controllers/checkoutController";

export const checkoutRoutes = express.Router();

checkoutRoutes.post("/checkout-payment", checkoutHandler);
checkoutRoutes.get("/checkout-order-history", orderHistory);
checkoutRoutes.get("/checkout-order-details/:order_id", orderDetails);
