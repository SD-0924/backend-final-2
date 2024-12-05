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

describe("Get Product API", () => {
  // Test1
  it("should return a specific product", async () => {
    jest.spyOn(productService, "findProductById").mockResolvedValue({
      name: "clock",
      description: "description",
      price: 100,
      stock: 11,
      discount_percentage: 20,
      product_image_url: "",
      price_after_discount: 80,
      number_of_ratings: 5,
      average_rating: 4,
    });

    const response = await request(app).get("/api/product/1").send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("description", "description");
    expect(response.body).toHaveProperty("name", "clock");
    expect(response.body).toHaveProperty("price", 100);
    expect(response.body).toHaveProperty("stock", 11);
    expect(response.body).toHaveProperty("discount_percentage", 20);
    expect(response.body).toHaveProperty("price_after_discount", 80);
    expect(response.body).toHaveProperty("number_of_ratings", 5);
    expect(response.body).toHaveProperty("average_rating", 4);
  });

  // Test2
  it("should return an empty JSON because product does not exist", async () => {
    jest.spyOn(productService, "findProductById").mockResolvedValue({});

    const response = await request(app).get("/api/product/2").send();

    expect(response.status).toBe(200);
    expect(Object.keys(response.body).length).toBe(0);
  });

  // Test3
  it("should return an error message because product id not valid", async () => {
    const response = await request(app).get("/api/product/aaa").send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Product id must be a positive integer"
    );
  });
});
