import { Request, Response } from 'express';
import { createMerchant } from '../src/controllers/merchantController';
import MerchantService from '../src/services/merchantService';
import { error } from 'console';

// Mock the MerchantService
jest.mock('../src/services/merchantService');

describe('Merchant Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  const validMerchantData = {
    name: "John Smith",
    businessAddress: "123 Business Avenue, Suite 200, New York, NY 10001",
    businessName: "Smith Enterprises",
    email: "john.smith@smithenterprises.com",
    role: "admin",
    phone: "+14155552671",
    password: "SecurePass123@"
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup mock response
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock
    };
  });

  describe('createMerchant', () => {
    it('should create a merchant successfully', async () => {
      mockRequest = {
        body: validMerchantData
      };

      (MerchantService.createUser as jest.Mock).mockResolvedValue({});

      await createMerchant(
        mockRequest as Request, 
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        message: 'Merchant created successfully'
      });
    });

    const invalidScenarios = [
      {
        name: 'invalid name (too short)',
        data: { ...validMerchantData, name: 'A' },
        expectedMessage: '"name" length must be at least 2 characters long'
      },
      {
        name: 'invalid email',
        data: { ...validMerchantData, email: 'invalid-email' },
        expectedMessage: '"email" must be a valid email'
      },
      {
        name: 'invalid password (missing special character)',
        data: { ...validMerchantData, password: 'NoSpecialChar123' },
        expectedMessage: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      },
      {
        name: 'invalid role',
        data: { ...validMerchantData, role: 'invalid-role' },
        expectedMessage: '"role" must be one of [admin, manager, staff]'
      }
    ];

    invalidScenarios.forEach(scenario => {
      it(`should return 400 for ${scenario.name}`, async () => {
        mockRequest = {
          body: scenario.data
        };

        await createMerchant(
          mockRequest as Request, 
          mockResponse as Response
        );

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'error',
            message: expect.stringContaining(scenario.expectedMessage)
          })
        );
      });
    });

    it('should handle internal server error', async () => {
      mockRequest = {
        body: validMerchantData
      };

      (MerchantService.createUser as jest.Mock).mockRejectedValue(new Error('Database error'));

      await createMerchant(
        mockRequest as Request, 
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'error',
        message: 'Internal server error',
        details: expect.any(Error)
      });
    });
  });
});