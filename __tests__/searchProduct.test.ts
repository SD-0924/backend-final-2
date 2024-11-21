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

describe("New Arrivals Product API", () => {
  // Test1
  it("should return a list of products", async () => {
    jest.spyOn(productService, "findProductsByText").mockResolvedValue([
      {
        product_id: 2,
        name: "bang",
        description: "asd",
        price: 11,
        discount_percentage: 10,
        product_image_url: "http:\\\\2",
        price_after_discount: 9.9,
        number_of_ratings: 2,
        average_rating: 4,
      },
      {
        product_id: 4,
        name: "keyboard",
        description: "asd",
        price: 112.22,
        discount_percentage: 22.5,
        product_image_url: "http:\\\\4",
        price_after_discount: 86.97,
        number_of_ratings: 0,
        average_rating: null,
      },
    ]);

    const response = await request(app).get("/api/search/b").send();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("product_id", 2);
    expect(response.body[0]).toHaveProperty("name", "bang");
    expect(response.body[0]).toHaveProperty("description", "asd");
    expect(response.body[1]).toHaveProperty("product_id", 4);
    expect(response.body[1]).toHaveProperty("name", "keyboard");
    expect(response.body[1]).toHaveProperty("description", "asd");
  });

  // Test2
  it("should return empty list", async () => {
    jest.spyOn(productService, "findProductsByText").mockResolvedValue([]);

    const response = await request(app).get("/api/search/b").send();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });
});
