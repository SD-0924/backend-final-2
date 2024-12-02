// import supertest module to test express routes
import request from "supertest";

// Import express module
import express from "express";

// Import Router method
import { productRoutes } from "../src/routes/productRoutes";

// Import product service
import { productService } from "../src/services/productService";

// Mocking the product model
jest.mock("../src/models/ProductModel");

// Initialize an Express application
const app = express();

// Handle existing routes after base URL
app.use("/api", productRoutes);

describe("Related Products API", () => {
  // Test1
  it("should return related products for specific product", async () => {
    jest.spyOn(productService, "getRelatedProducts").mockResolvedValue([
      {
        product_id: 2,
        name: "Intelligent Rubber Shirt",
        price: 2978,
        brand_name: "Omega",
        discount_percentage: 42,
        product_image_url: "https://i.ibb.co/W0Vrwhg/2.jpg",
        averageRating: 3.6,
        NumberOfRatings: 10,
        price_after_discount: 1727.24,
      },
      {
        product_id: 3,
        name: "Handcrafted Frozen Shirt",
        price: 1061,
        brand_name: "Omega",
        discount_percentage: 89,
        product_image_url: "https://i.ibb.co/y8THynM/3.jpg",
        averageRating: 2.875,
        NumberOfRatings: 8,
        price_after_discount: 116.71,
      },
      {
        product_id: 4,
        name: "Ergonomic Rubber Chicken",
        price: 3074,
        brand_name: "Tiffany & Co.",
        discount_percentage: 41,
        product_image_url: "https://i.ibb.co/W3qp5LX/4.jpg",
        averageRating: 2.75,
        NumberOfRatings: 8,
        price_after_discount: 1813.66,
      },
      {
        product_id: 5,
        name: "Handcrafted Granite Pizza",
        price: 624,
        brand_name: "Omega",
        discount_percentage: 57,
        product_image_url: "https://i.ibb.co/Mg17G0D/5.jpg",
        averageRating: 2.3333,
        NumberOfRatings: 9,
        price_after_discount: 268.32,
      },
      {
        product_id: 6,
        name: "Small Rubber Chips",
        price: 3194,
        brand_name: "Rolex",
        discount_percentage: 86,
        product_image_url: "https://i.ibb.co/fvP55BW/6.jpg",
        averageRating: 2.5,
        NumberOfRatings: 8,
        price_after_discount: 447.16,
      },
    ]);

    const response = await request(app).get("/api/products/Apparels/1").send();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(5);
  });

  // Test2
  it("should return error message when product id not valid", async () => {
    jest.spyOn(productService, "getNewArrivalsProducts").mockResolvedValue([]);

    const response = await request(app).get("/api/products/Apparels/aa").send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "product id should be positive integer number"
    );
  });
});
