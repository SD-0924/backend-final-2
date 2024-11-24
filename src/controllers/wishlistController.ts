import { Request, Response } from "express";
import WishlistService from "../services/wishlistService";

export default class WishlistController {
  // Create a new wishlist item
  static async createWishlistItem(req: Request, res: Response) {
    const { userId, productId } = req.body;

    try {
      const newWishlistItem = await WishlistService.createWishlistItem(
        parseInt(userId),
        parseInt(productId)
      );

      res.status(201).json(newWishlistItem);
    } catch (error) {
      res.status(500).json({ message: "Error creating wishlist item.", error });
    }
  }

  // Get all wishlist items for a user
  static async getAllWishlistItems(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const wishlistItems = await WishlistService.findAllWishlistItems(
        parseInt(userId)
      );

      res.status(200).json(wishlistItems);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching wishlist items.", error });
    }
  }

  // Remove a wishlist item
  static async deleteWishlistItem(req: Request, res: Response) {
    const { wishlistId } = req.params;

    try {
      const deleted = await WishlistService.destroyWishlistItem(
        parseInt(wishlistId)
      );

      if (!deleted) {
        res.status(404).json({ message: "Wishlist item not found." });
      }

      res.status(200).json({ message: "Wishlist item deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error deleting wishlist item.", error });
    }
  }
}
