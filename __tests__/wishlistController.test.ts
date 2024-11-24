import { Request, Response } from "express";
import WishlistController from "../src/controllers/wishlistController";
import WishlistService from "../src/services/wishlistService";

// Mock the WishlistService
jest.mock("../src/services/wishlistService", () => ({
  createWishlistItem: jest.fn(),
  findAllWishlistItems: jest.fn(),
  destroyWishlistItem: jest.fn(),
}));

describe("Wishlist Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();

    // Setup mock response
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe("createWishlistItem", () => {
    it("should create a wishlist item successfully and return 201", async () => {
      mockRequest = {
        body: { userId: "1", productId: "101" },
      };

      const mockWishlistItem = { id: 1, userId: 1, productId: 101 };
      (WishlistService.createWishlistItem as jest.Mock).mockResolvedValue(
        mockWishlistItem
      );

      await WishlistController.createWishlistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockWishlistItem);
    });

    it("should return 400 for invalid userId or productId", async () => {
      mockRequest = {
        body: { userId: "abc", productId: "" },
      };

      await WishlistController.createWishlistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Invalid userId or productId. They must be valid numbers.",
        })
      );
    });
  });

  describe("getAllWishlistItems", () => {
    it("should fetch all wishlist items for a user and return 200", async () => {
      mockRequest = {
        params: { userId: "1" },
      };

      const mockWishlistItems = [
        { id: 1, userId: 1, productId: 101 },
        { id: 2, userId: 1, productId: 102 },
      ];
      (WishlistService.findAllWishlistItems as jest.Mock).mockResolvedValue(
        mockWishlistItems
      );

      await WishlistController.getAllWishlistItems(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockWishlistItems);
    });

    it("should return 400 for invalid userId", async () => {
      mockRequest = {
        params: { userId: "abc" },
      };

      await WishlistController.getAllWishlistItems(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Invalid userId. It must be a valid number.",
        })
      );
    });
  });

  describe("deleteWishlistItem", () => {
    it("should delete a wishlist item successfully and return 200", async () => {
      mockRequest = {
        params: { wishlistId: "1" },
      };

      (WishlistService.destroyWishlistItem as jest.Mock).mockResolvedValue(
        true
      );

      await WishlistController.deleteWishlistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Wishlist item deleted successfully.",
      });
    });

    it("should return 404 if the wishlist item is not found", async () => {
      mockRequest = {
        params: { wishlistId: "1" },
      };

      (WishlistService.destroyWishlistItem as jest.Mock).mockResolvedValue(
        false
      );

      await WishlistController.deleteWishlistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Wishlist item not found.",
        })
      );
    });

    it("should return 400 for invalid wishlistId", async () => {
      mockRequest = {
        params: { wishlistId: "abc" },
      };

      await WishlistController.deleteWishlistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Invalid wishlistId. It must be a valid number.",
        })
      );
    });
  });
});
