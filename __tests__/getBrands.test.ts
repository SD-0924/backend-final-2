import { Request, Response } from "express";
import { getBrands } from "../src/controllers/productController";
import { productService } from "../src/services/productService";
const resolvedValue = [
  {
    brand_image_url: "https://example.com/images/audiobrand-logo.jpg",
    brand_name: "AudioBrand",
  },
  {
    brand_image_url: "https://example.com/images/audiobrand-logo.jpg",
    brand_name: "brand 2",
  },
  {
    brand_image_url: "https://example.com/images/audiobrand-logo.jpg",
    brand_name: "brand 3",
  },
];

let req: Partial<Request>;
let res: Partial<Response>;

jest.mock("../src/services/productService", () => ({
  productService: {
    getBrandsService: jest.fn(),
  },
}));

describe("Testing the /api/brands endpoint", () => {
  req = {};
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  it("should return status code 200 when  hitting the endpoint", async () => {
    (productService.getBrandsService as jest.Mock).mockResolvedValue(
      resolvedValue
    );

    await getBrands(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return status code 404 when  hitting the endpoint and no brands found", async () => {
    (productService.getBrandsService as jest.Mock).mockResolvedValue([]);

    await getBrands(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return status code 500 when database error", async () => {
    (productService.getBrandsService as jest.Mock).mockRejectedValueOnce(
      new Error()
    );

    await getBrands(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
