import { Router } from 'express'
import cartController from '../controllers/cartController'

const router = Router()

// Route to add an item to the cart
router.post('/', cartController.addItemToCart)

// Route to get all cart items for a user
router.get('/:userId', cartController.getUserCart)

// Route to update the quantity of a cart item
router.put('/:cartItemId', cartController.updateCartItem)

// Route to remove a cart item by cartItemId
router.delete('/:cartItemId', cartController.removeCartItem)

export default router
