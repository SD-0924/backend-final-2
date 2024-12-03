import { Request, Response } from 'express'
import CartController from '../src/controllers/cartController'
import CartService from '../src/services/cartServices'

// Mock the CartService
jest.mock('../src/services/cartServices', () => ({
  addItemToCart: jest.fn(),
  getUserCart: jest.fn(),
  updateCartItem: jest.fn(),
  removeCartItem: jest.fn(),
}))

describe('Cart Controller', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let statusMock: jest.Mock
  let jsonMock: jest.Mock

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks()

    // Setup mock response
    jsonMock = jest.fn()
    statusMock = jest.fn().mockReturnValue({ json: jsonMock })
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    }
  })

  describe('addItemToCart', () => {
    it('should add an item to the cart successfully and return 201', async () => {
      mockRequest = {
        body: { userId: '1', productId: '101', quantity: '2' },
      }

      const mockCartItem = { id: 1, userId: 1, productId: 101, quantity: 2 }
      ;(CartService.addItemToCart as jest.Mock).mockResolvedValue(mockCartItem)

      await CartController.addItemToCart(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(statusMock).toHaveBeenCalledWith(201)
      expect(jsonMock).toHaveBeenCalledWith(mockCartItem)
    })

    it('should return 400 for invalid input', async () => {
      mockRequest = {
        body: { userId: 'abc', productId: '', quantity: '2' },
      }

      await CartController.addItemToCart(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(statusMock).toHaveBeenCalledWith(400)
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message:
            'Invalid input. userId, productId, and quantity must be valid numbers.',
        })
      )
    })
  })

  describe('getUserCart', () => {
    it('should fetch all cart items for a user and return 200', async () => {
      mockRequest = {
        params: { userId: '1' },
      }

      const mockCartItems = [
        { id: 1, userId: 1, productId: 101, quantity: 2 },
        { id: 2, userId: 1, productId: 102, quantity: 1 },
      ]
      ;(CartService.getUserCart as jest.Mock).mockResolvedValue(mockCartItems)

      await CartController.getUserCart(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(statusMock).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith(mockCartItems)
    })

    it('should return 400 for invalid userId', async () => {
      mockRequest = {
        params: { userId: 'abc' },
      }

      await CartController.getUserCart(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(statusMock).toHaveBeenCalledWith(400)
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid userId. It must be a valid number.',
        })
      )
    })
  })

  describe('updateCartItem', () => {
    it('should update the cart item quantity successfully and return 200', async () => {
      mockRequest = {
        params: { cartItemId: '1' },
        body: { newQuantity: '3' },
      }

      const mockUpdatedCartItem = {
        id: 1,
        userId: 1,
        productId: 101,
        quantity: 3,
      }
      ;(CartService.updateCartItem as jest.Mock).mockResolvedValue(
        mockUpdatedCartItem
      )

      await CartController.updateCartItem(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(statusMock).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith(mockUpdatedCartItem)
    })

    it('should return 400 for invalid cartItemId or newQuantity', async () => {
      mockRequest = {
        params: { cartItemId: 'abc' },
        body: { newQuantity: 'xyz' },
      }

      await CartController.updateCartItem(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(statusMock).toHaveBeenCalledWith(400)
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message:
            'Invalid input. cartItemId and newQuantity must be valid numbers.',
        })
      )
    })
  })

  describe('removeCartItem', () => {
    it('should remove a cart item successfully and return 200', async () => {
      mockRequest = {
        params: { cartItemId: '1' },
      }
      ;(CartService.removeCartItem as jest.Mock).mockResolvedValue(true)

      await CartController.removeCartItem(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(statusMock).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Cart item deleted successfully.',
      })
    })

    it('should return 404 if the cart item is not found', async () => {
      mockRequest = {
        params: { cartItemId: '1' },
      }
      ;(CartService.removeCartItem as jest.Mock).mockResolvedValue(false)

      await CartController.removeCartItem(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(statusMock).toHaveBeenCalledWith(404)
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Cart item not found.',
        })
      )
    })

    it('should return 400 for invalid cartItemId', async () => {
      mockRequest = {
        params: { cartItemId: 'abc' },
      }

      await CartController.removeCartItem(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(statusMock).toHaveBeenCalledWith(400)
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid cartItemId. It must be a valid number.',
        })
      )
    })
  })
})
