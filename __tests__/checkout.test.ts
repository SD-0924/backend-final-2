import {
  orderHistory,
  orderDetails,
} from "../src/controllers/checkoutController"; // Adjust the path
import { Request, Response, NextFunction } from "express";
import { orderService } from "../src/services/orderService"; // Adjust the path
import { productService } from "../src/services/productService"; // Adjust the path

jest.mock("../src/services/orderService", () => ({
  orderService: {
    createOrder: jest.fn(),
    getAllOrders: jest.fn(),
  },
})); // Mock orderService
jest.mock("../src/services/productService", () => ({
  productService: {
    getCartProducts: jest.fn(),
    getOrderProducts: jest.fn(),
    addDiscountInfo: jest.fn(),
  },
})); // Mock productService

describe("Order Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("orderHistory", () => {
    it("should return a list of orders", async () => {
      // Arrange
      const mockOrders = [{ id: 1, item: "Sample Order" }];
      (orderService.getAllOrders as jest.Mock).mockResolvedValue(mockOrders);

      mockReq.body = { user_id: 1 };

      // Act
      await orderHistory(mockReq as Request, mockRes as Response, mockNext);

      // Assert
      expect(orderService.getAllOrders).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockOrders);
    });

    it("should handle errors", async () => {
      // Arrange
      const errorMessage = "Something went wrong";
      (orderService.getAllOrders as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      mockReq.body = { user_id: 1 };

      // Act
      await orderHistory(mockReq as Request, mockRes as Response, mockNext);

      // Assert
      expect(orderService.getAllOrders).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "error",
        message: errorMessage,
        details: expect.any(Error),
      });
    });
  });

  describe("orderDetails", () => {
    it("should return order details", async () => {
      // Arrange
      const mockOrderItems = [{ product: "Sample Product", quantity: 2 }];
      (productService.getOrderProducts as jest.Mock).mockResolvedValue(
        mockOrderItems
      );

      mockReq.params = { order_id: "1" };
      mockReq.body = { user_id: 1 };

      // Act
      await orderDetails(mockReq as Request, mockRes as Response, mockNext);

      // Assert
      expect(productService.getOrderProducts).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockOrderItems);
    });

    it("should handle missing order_id", async () => {
      // Arrange
      mockReq.params = {};
      mockReq.body = { user_id: 1 };

      // Act
      await orderDetails(mockReq as Request, mockRes as Response, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "error",
        message: "no order id provided",
        details: expect.any(Error),
      });
    });

    it("should handle errors", async () => {
      // Arrange
      const errorMessage = "Something went wrong";
      (productService.getOrderProducts as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      mockReq.params = { order_id: "1" };
      mockReq.body = { user_id: 1 };

      // Act
      await orderDetails(mockReq as Request, mockRes as Response, mockNext);

      // Assert
      expect(productService.getOrderProducts).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "error",
        message: errorMessage,
        details: expect.any(Error),
      });
    });
  });
});
