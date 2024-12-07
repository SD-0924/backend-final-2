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

describe("Get Products By Category Name API", () => {
  // Test1
  it("should return all products that belongs to category", async () => {
    jest.spyOn(productService, "findProductsByCategory").mockResolvedValue({
      number_of_pages: 1,
      products: [
        {
          product_id: 1,
          name: "watch",
          description: "this is just for test",
          price: 220,
          brand_name: "DD",
          discount_percentage: 0,
          product_image_url: null,
          price_after_discount: null,
          number_of_ratings: 4,
          average_rating: 2.5,
        },
        {
          product_id: 2,
          name: "clock",
          description: "description",
          price: 100,
          brand_name: "ZARA",
          discount_percentage: 20,
          product_image_url: "",
          price_after_discount: 80,
          number_of_ratings: 2,
          average_rating: 2.5,
        },
      ],
    });

    const response = await request(app)
      .get("/api/products/skinCare?page=1")
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("number_of_pages", 1);
    expect(Array.isArray(response.body.products)).toBe(true);
    expect(response.body.products.length).toBe(2);
    expect(response.body.products[0]).toHaveProperty("product_id", 1);
    expect(response.body.products[0]).toHaveProperty("name", "watch");
    expect(response.body.products[0]).toHaveProperty(
      "description",
      "this is just for test"
    );
    expect(response.body.products[0]).toHaveProperty("brand_name", "DD");
    expect(response.body.products[0]).toHaveProperty("price", 220);

    expect(response.body.products[0]).toHaveProperty("discount_percentage", 0);
    expect(response.body.products[0]).toHaveProperty(
      "price_after_discount",
      null
    );
    expect(response.body.products[0]).toHaveProperty("number_of_ratings", 4);
    expect(response.body.products[0]).toHaveProperty("average_rating", 2.5);
    expect(response.body.products[1]).toHaveProperty("product_id", 2);
    expect(response.body.products[1]).toHaveProperty("name", "clock");
    expect(response.body.products[1]).toHaveProperty(
      "description",
      "description"
    );
    expect(response.body.products[1]).toHaveProperty("brand_name", "ZARA");
    expect(response.body.products[1]).toHaveProperty("price", 100);

    expect(response.body.products[1]).toHaveProperty("discount_percentage", 20);
    expect(response.body.products[1]).toHaveProperty(
      "price_after_discount",
      80
    );
    expect(response.body.products[1]).toHaveProperty("number_of_ratings", 2);
    expect(response.body.products[1]).toHaveProperty("average_rating", 2.5);
  });

  // Test2
  it("should return an empty JSON because no products belongs to category", async () => {
    jest.spyOn(productService, "findProductsByCategory").mockResolvedValue({});

    const response = await request(app)
      .get("/api/products/handbags?page=1")
      .send();

    expect(response.status).toBe(200);
    expect(Object.keys(response.body).length).toBe(0);
  });

  // Test3
  it("should return an error message because page number not provided", async () => {
    const response = await request(app).get("/api/products/handbags").send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "You should provide a page number in URL as query params"
    );
  });

  // Test4
  it("should return an error message because page number invalid", async () => {
    const response = await request(app)
      .get("/api/products/handbags?page=aaa")
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Page number should be positive integer number"
    );
  });
});
