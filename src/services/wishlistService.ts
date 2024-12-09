import { WishlistItem } from "../models/WishListItemModel";

export default class WishlistService {
  // Create a new wishlist item
  static async createWishlistItem(userId: number, productId: number) {
    const newWishlistItem = await WishlistItem.create({
      user_id: userId,
      product_id: productId,
    });
    return newWishlistItem;
  }

  // Find all wishlist items for a specific user
  static async findAllWishlistItems(userId: number) {
    const wishlistItems = await WishlistItem.findAll({
      where: {
        user_id: userId,
      },
    });
    return wishlistItems;
  }

  // Remove a wishlist item by user_id and product_id
  static async destroyWishlistItem(wishlist: number) {
    const deleted = await WishlistItem.destroy({
      where: {
        wishlistItem_Id: wishlist,
      },
    });
    return deleted; // Returns the number of rows deleted
  }
}
