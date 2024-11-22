import { Request, Response } from 'express';
import { getProductsByBrand, createProductController } from '../src/controllers/productController';
import * as ProductServices from '../src/services/productService';

// Mock the ProductServices
jest.mock('../src/services/productService');

describe('Product Controllers', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

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

  describe('getProductsByBrand', () => {
    it('should return products when brand name is valid', async () => {
      // Prepare mock request
      mockRequest = {
        params: { brandName: 'TechGear' }
      };

      // Mock the service response
      const mockServiceResponse = {
        status: 200,
        response: [
          { 
            name: 'Wireless Headphones', 
            brand_name: 'TechGear' 
          }
        ]
      };
      (ProductServices.getProductByBrand as jest.Mock).mockResolvedValue(mockServiceResponse);

      // Call the controller
      await getProductsByBrand(
        mockRequest as Request, 
        mockResponse as Response
      );

      // Assertions
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockServiceResponse.response);
    });

    it('should return 400 error for invalid brand name', async () => {
      // Prepare mock request with invalid brand name
      mockRequest = {
        params: { brandName: '' }
      };

      // Call the controller
      await getProductsByBrand(
        mockRequest as Request, 
        mockResponse as Response
      );

      // Assertions
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String)
        })
      );
    });
  });

  describe('createProductController', () => {
    const validProduct = {
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise-cancellation features.',
      price: 99.99,
      stock: 50,
      brand_name: 'TechGear',
      merchant_id: 1
    };

    it('should create a product successfully', async () => {
      // Prepare mock request
      mockRequest = {
        body: validProduct
      };

      // Mock the service response
      const mockServiceResponse = {
        status: 201,
        response: { 
          ...validProduct, 
          id: 1 
        }
      };
      (ProductServices.createProduct as jest.Mock).mockResolvedValue(mockServiceResponse);

      // Call the controller
      await createProductController(
        mockRequest as Request, 
        mockResponse as Response
      );

      // Assertions
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockServiceResponse.response);
    });

    it('should return 400 error for invalid product data', async () => {
      // Prepare mock request with invalid product data
      mockRequest = {
        body: {
          ...validProduct,
          name: '' // Invalid name (empty string)
        }
      };

      // Call the controller
      await createProductController(
        mockRequest as Request, 
        mockResponse as Response
      );

      // Assertions
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String)
        })
      );
    });

    // Test various validation scenarios
    const invalidProductScenarios = [
      {
        name: 'short name',
        product: { ...validProduct, name: 'a' },
        expectedErrorMessage: 'Product name must be at least 2 characters'
      },
      {
        name: 'negative price',
        product: { ...validProduct, price: -10 },
        expectedErrorMessage: 'Price must be greater than 0'
      },
      {
        name: 'negative stock',
        product: { ...validProduct, stock: -5 },
        expectedErrorMessage: 'Stock cannot be negative'
      }
    ];

    invalidProductScenarios.forEach(scenario => {
      it(`should return 400 for ${scenario.name}`, async () => {
        mockRequest = {
          body: scenario.product
        };

        await createProductController(
          mockRequest as Request, 
          mockResponse as Response
        );

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith(
          expect.objectContaining({
            error: expect.stringContaining(scenario.expectedErrorMessage)
          })
        );
      });
    });
  });
});