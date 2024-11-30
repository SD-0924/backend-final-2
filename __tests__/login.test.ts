import { login } from '../src/controllers/authController'
import UserService from '../src/services/userServices'
import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import generateToken from '../src/utils/generateToken'
import { log } from 'console'

// Mock the service
jest.mock('../src/services/userServices', () => ({
  findUserByEmail: jest.fn(),
}))

// Mock external dependencies
jest.mock('bcrypt')
jest.mock('../src/utils/generateToken', () => jest.fn())

describe('login controller', () => {
  const mockUser = {
    dataValues: {
      user_id: 1,
      password: 'M234546r423r',
    },
  }

  const mockRequestData = {
    email: 'test@gmail.com',
    password: 'M234546r423r',
    role: 'user',
  }

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

  describe('User login', () => {
    it('should successfully login and return 200', async () => {
      mockRequest = { body: { ...mockRequestData } }

      // Mock UserService to return a valid user
      ;(UserService.findUserByEmail as jest.Mock).mockResolvedValue(mockUser)

      // Mock bcrypt to validate the password
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      // Mock token generation
      ;(generateToken as jest.Mock).mockReturnValue('mockToken')

      // Call the controller
      await login(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(UserService.findUserByEmail).toHaveBeenCalledWith(
        mockRequestData.email
      )
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockRequestData.password,
        mockUser.dataValues.password
      )
      expect(generateToken).toHaveBeenCalledWith({
        id: mockUser.dataValues.user_id,
        role: mockRequestData.role,
      })
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ token: 'mockToken' })
    })

    it('should return 404 when credentials are incorrect', async () => {
      mockRequest = { body: { ...mockRequestData } }

      // Mock UserService to return a valid user
      ;(UserService.findUserByEmail as jest.Mock).mockResolvedValue(mockUser)

      // Mock bcrypt password validation to resolve to false
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      // Call the controller
      await login(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(UserService.findUserByEmail).toHaveBeenCalledWith(
        mockRequestData.email
      )
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockRequestData.password,
        mockUser.dataValues.password
      )
      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).not.toHaveBeenCalledWith({
        token: expect.any(String),
      })
    })
  })
})
