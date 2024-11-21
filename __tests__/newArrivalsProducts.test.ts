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
  it("should return a list of new arrivals products", async () => {
    jest.spyOn(productService, "getNewArrivalsProducts").mockResolvedValue([
      {
        product_id: 1,
        name: "watch",
        description: "this is asd",
        price: 200,
        discount_percentage: 0,
        product_image_url: "http:\\\\1",
        price_after_discount: null,
      },
      {
        product_id: 3,
        name: "mouse",
        description: "rasr",
        price: 200.5,
        discount_percentage: 50,
        product_image_url: "http:\\\\3",
        price_after_discount: 100.25,
      },
    ]);

    const response = await request(app).get("/api/newArrivals").send();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("product_id", 1);
    expect(response.body[0]).toHaveProperty("name", "watch");
    expect(response.body[0]).toHaveProperty("description", "this is asd");
    expect(response.body[1]).toHaveProperty("product_id", 3);
    expect(response.body[1]).toHaveProperty("name", "mouse");
    expect(response.body[1]).toHaveProperty("description", "rasr");
  });

  // Test2
  it("should return empty list", async () => {
    jest.spyOn(productService, "getNewArrivalsProducts").mockResolvedValue([]);

    const response = await request(app).get("/api/newArrivals").send();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });
});
