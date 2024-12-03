import { CartItem } from "../models/CartItemModel";
import { Product } from "../models/ProductModel";

export default class CartService {
  // Add item to the cart after checking stock
  static async addItemToCart(userId: number, productId: number, quantity: number) {
    // Find the product by ID
    const product = await Product.findByPk(productId);

    if (!product) {
      throw new Error("Product not found.");
    }

    // Check if the requested quantity is available
    if (quantity > product.getDataValue("stock")) {
      throw new Error(
        `Requested quantity (${quantity}) exceeds available stock (${product.getDataValue("stock")}).`
      );
    }

    // Add the item to the cart
    const cartItem = await CartItem.create({
      user_id: userId,
      product_id: productId,
      quantity: quantity,
    });

    return cartItem;
  }

  // Get all items in a user's cart
  static async getUserCart(userId: number) {
    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      include: [{ model: Product, as: "productDetails" }],
    });
    return cartItems;
  }

  // Update the quantity of an item in the cart
  static async updateCartItem(cartItemId: number, newQuantity: number) {
    const cartItem = await CartItem.findByPk(cartItemId);

    if (!cartItem) {
      throw new Error("Cart item not found.");
    }

    // Fetch the product details
    const product = await Product.findByPk(cartItem.getDataValue("product_id"));

    if (!product) {
      throw new Error("Product not found.");
    }

    // Check if the new quantity is available in stock
    if (newQuantity > product.getDataValue("stock")) {
      throw new Error(
        `Requested quantity (${newQuantity}) exceeds available stock}).`
      );
    }

    // Update the cart item quantity
    cartItem.set({ quantity: newQuantity });
    await cartItem.save();

    return cartItem;
  }

  // Remove an item from the cart
  static async removeCartItem(cartItemId: number) {
    const deleted = await CartItem.destroy({
      where: { cartItem_id: cartItemId },
    });

    return deleted; // Returns the number of rows deleted
  }
}