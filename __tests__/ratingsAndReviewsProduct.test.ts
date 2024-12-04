// import supertest module to test express routes
import request from "supertest";

// Import express module
import express from "express";

// Import Router method
import { ratingRouter } from "../src/routes/ratingRoutes";

// Import product service
import { ratingService } from "../src/services/ratingService";

// Mocking the product model
jest.mock("../src/models/RatingModel");

// Initialize an Express application
const app = express();

// Handle existing routes after base URL
app.use("/api", ratingRouter);

describe("Ratings and Reviews for Product API", () => {
  // Test1
  it("should return all ratings and reviews for specific product", async () => {
    jest
      .spyOn(ratingService, "retrieveProductRatingsAndReviews")
      .mockResolvedValue([
        {
          rating: 1,
          review: "Excellent value for the price!",
        },
        {
          rating: 4,
          review: "Very good, I would buy again.",
        },
        {
          rating: 2,
          review: "Totally worth it, five stars!",
        },
        {
          rating: 2,
          review: "Great product, highly recommend!",
        },
      ]);

    const response = await request(app).get("/api/productRating/1").send();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(4);
  });

  // Test2
  it("should return error message when product id not valid", async () => {
    const response = await request(app).get("/api/productRating/aa").send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "product id must be a positive integer number"
    );
  });
});
