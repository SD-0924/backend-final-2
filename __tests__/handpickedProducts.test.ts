import { Request, Response } from "express";
import { getHandPicked } from "../src/controllers/productController";
import {
  Custom404Error,
  productCategoryService,
} from "../src/services/productCategoryService";

let req: Partial<Request>;
let res: Partial<Response>;

jest.mock("../src/services/productCategoryService", () => ({
  productCategoryService: {
    handPickedService: jest.fn(),
  },
  Custom404Error: jest.requireActual("../src/services/productCategoryService")
    .Custom404Error,
}));

res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const mockData = {
  count: 1,
  numberOfPages: 1,
  products: [
    {
      product_id: 12,
      name: "Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation.",
      price: 57,
      stock: 50,
      merchant_id: 1,
      brand_name: "AudioBrand",
      discount_percentage: 10,
      product_image_url: "https://example.com/images/wireless-headphones.jpg",
      brand_image_url: "https://example.com/images/audiobrand-logo.jpg",
      averageRating: 5,
      NumberOfRatings: 1,
      createdAt: "2024-11-24T21:16:56.000Z",
      updatedAt: "2024-11-30T21:24:19.000Z",
      "categories.category_id": 1,
      "categories.name": "Skin care",
      price_after_discount: 51.3,
    },
  ],
};

describe("Testing GET /:categoryId/handpicked endpoint", () => {
  it("Should return 200 with data if the request has valid category and page", async () => {
    req = {
      params: {
        categoryId: "1",
      },
      query: {
        page: "1",
      },
    };

    (productCategoryService.handPickedService as jest.Mock).mockResolvedValue(
      mockData
    );

    await getHandPicked(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      ...mockData,
    });
  });

  it("Should return 400 with data if the request has invalid category and page", async () => {
    req = {
      params: {
        categoryId: "invalid",
      },
      query: {
        page: "invalid",
      },
    };

    await getHandPicked(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      massage: "please provide valid category or page",
    });
  });

  it("Should return 404 if category does not exist", async () => {
    req = {
      params: {
        categoryId: "5555",
      },
      query: {
        page: "1",
      },
    };
    (productCategoryService.handPickedService as jest.Mock).mockRejectedValue(
      new Custom404Error("page not found")
    );
    await getHandPicked(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "page not found",
      success: false,
    });
  });

  it("Should return 404 if page does not exist", async () => {
    req = {
      params: {
        categoryId: "1",
      },
      query: {
        page: "9899898",
      },
    };
    (productCategoryService.handPickedService as jest.Mock).mockRejectedValue(
      new Custom404Error("page not found")
    );
    await getHandPicked(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "page not found",
      success: false,
    });
  });
});
