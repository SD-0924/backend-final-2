import { Router } from "express";
import cartController from "../controllers/cartController";

const cartRouter = Router();

// Route to add an item to the cart
cartRouter.post("/", cartController.addItemToCart);

// Route to get all cart items for a user
cartRouter.get("/:userId", cartController.getUserCart);

// Route to update the quantity of a cart item
cartRouter.put("/:cartItemId", cartController.updateCartItem);

// Route to remove a cart item by cartItemId
cartRouter.delete("/:cartItemId", cartController.removeCartItem);

export default cartRouter;
