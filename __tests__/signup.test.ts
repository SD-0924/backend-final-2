import { signUp } from '../src/controllers/authController'
import { Request, Response, NextFunction } from 'express'
import UserService from '../src/services/userServices'
import MerchantService from '../src/services/merchantService'
import { error } from 'console'

// Mock the services
jest.mock('../src/services/userServices', () => ({
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
}))

jest.mock('../src/services/merchantService', () => ({
  createUser: jest.fn(),
  findMerchantByEmail: jest.fn(),
}))

describe('Auth Controller - Sign Up', () => {
  // Test data
  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    dateOfBirth: '1990-05-15',
    password: 'SecurePassword123',
    address: '123 Main Street, Springfield, USA',
    role: 'user',
  }

  const mockMerchant = {
    name: 'John Doe',
    email: 'john.merchant@example.com',
    password: 'securePassword123',
    businessName: "John's Coffee Shop",
    businessAddress: '123 Main Street, Springfield',
    dateOfBirth: '1990-10-10',
    phone: '+905340537088',
    role: 'merchant',
  }

  // Setup request, response, and next function mocks
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>
    nextFunction = jest.fn()

    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  describe('User Registration', () => {
    it('should successfully create a new user and return 201', async () => {
      mockRequest = {
        body: { ...mockUser },
      }

      ;(UserService.findUserByEmail as jest.Mock).mockResolvedValue(null)
      ;(UserService.createUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        user_id: 1,
      })

      await signUp(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(UserService.findUserByEmail).toHaveBeenCalledWith(mockUser.email)
      expect(UserService.createUser).toHaveBeenCalledWith(mockUser)
    })

    it('should return 400 if user email already exists', async () => {
      mockRequest = {
        body: { ...mockUser },
      }

      ;(UserService.findUserByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
      })

      await signUp(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
        })
      )
    })
  })

  describe('Merchant Registration', () => {
    it('should successfully create a new merchant and return 201', async () => {
      mockRequest = {
        body: { ...mockMerchant },
      }

      ;(MerchantService.findMerchantByEmail as jest.Mock).mockResolvedValue(
        null
      )
      ;(MerchantService.createUser as jest.Mock).mockResolvedValue({
        ...mockMerchant,
        merchant_id: 1,
      })

      await signUp(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(MerchantService.findMerchantByEmail).toHaveBeenCalledWith(
        mockMerchant.email
      )
      expect(MerchantService.createUser).toHaveBeenCalledWith(mockMerchant)
    })

    it('should return 400 if merchant email already exists', async () => {
      mockRequest = {
        body: { ...mockMerchant },
      }

      ;(MerchantService.findMerchantByEmail as jest.Mock).mockResolvedValue({
        ...mockMerchant,
      })

      await signUp(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
        })
      )
    })
  })

  describe('Validation Tests', () => {
    it('should return 400 for invalid password', async () => {
      mockRequest = {
        body: { ...mockMerchant, password: 'bad' },
      }

      await signUp(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(400)
    })

    it('should return 400 for invalid email', async () => {
      mockRequest = {
        body: { ...mockMerchant, email: 'invalid-email' },
      }

      await signUp(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(400)
    })

    it('should return 400 for invalid name', async () => {
      mockRequest = {
        body: { ...mockMerchant, name: 'a' },
      }

      await signUp(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(400)
    })
  })
})
