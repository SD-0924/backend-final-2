import express from "express";
import {
  addRating,
  updateRating,
  retrieveProductRatingsAndReviews,
} from "../controllers/ratingController";

export const ratingRouter = express.Router();

ratingRouter.post("/", addRating);
ratingRouter.put("/", updateRating);

// This route retrieves all ratings and reviews for a specific product
ratingRouter.get("/productRating/:productId", retrieveProductRatingsAndReviews);
