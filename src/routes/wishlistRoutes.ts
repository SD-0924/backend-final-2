import { Router } from "express";
import wishlistController from "../controllers/wishlistController";

const router = Router();

// Route to create a new wishlist item
router.post("/", wishlistController.createWishlistItem);

// Route to get all wishlist items for a user
router.get("/:userId", wishlistController.getAllWishlistItems);

// Route to delete a wishlist item by wishlistId
router.delete("/:wishlistId", wishlistController.deleteWishlistItem);

export default router;
