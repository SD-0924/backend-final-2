import { Request, Response } from "express";

//This function adds product to wishlest
export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const userId = "1234566"; //should be req.user.id
    const { productId } = req.body; // should get product id  from the request

    // Check if the product already exists in the wishlist
    const exists = await findeOneWishlistItem(); //this function finde product based on
    if (exists) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    // Add product to the wishlist
    const wishlistItem = await createWishlistItem();
    res.status(201).json(wishlistItem);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error adding to wishlist", error: error.message });
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const userId = "req.user.id;";

    // Fetch the wishlist items for the user
    const wishlistItems = await findAllWishlistItems();
    //User.findBPK(userid, {
    // include: [{
    //    Model: product
    //  }]
    // })

    res.status(200).json(wishlistItems);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching wishlist", error: error.message });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const wishlistId = "req.wishlist.id;";

    // Remove product from wishlist
    const rowsDeleted = await destroyWishlistItem(); // wishlist.destroy(wishlistId)

    if (rowsDeleted === 0) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error removing from wishlist", error: error.message });
  }
};
