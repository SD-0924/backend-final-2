import express from "express";
import { createMerchant } from "../controllers/merchantController";

const merchantRoutes= express.Router();

merchantRoutes.post("/merchant/create", createMerchant as any);

export default merchantRoutes;