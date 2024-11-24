import { Request, Response } from "express";
import WishlistService from "../services/wishlistService";

export default class WishlistController {
  // Create a new wishlist item
  static async createWishlistItem(req: Request, res: Response) {
    const { userId, productId } = req.body;

    // Input validation
    if (
      !userId ||
      !productId ||
      isNaN(parseInt(userId)) ||
      isNaN(parseInt(productId))
    ) {
      return res.status(400).json({
        message: "Invalid userId or productId. They must be valid numbers.",
      });
    }

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

    // Input validation
    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({
        message: "Invalid userId. It must be a valid number.",
      });
    }

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

    // Input validation
    if (!wishlistId || isNaN(parseInt(wishlistId))) {
      return res.status(400).json({
        message: "Invalid wishlistId. It must be a valid number.",
      });
    }

    try {
      const deleted = await WishlistService.destroyWishlistItem(
        parseInt(wishlistId)
      );

      if (!deleted) {
        return res.status(404).json({ message: "Wishlist item not found." });
      }

      res.status(200).json({ message: "Wishlist item deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error deleting wishlist item.", error });
    }
  }
}
