import { signUp } from "../src/controllers/authController";
import supertest from "supertest";
import express, { Request, Response, NextFunction } from "express";

import { User } from "../src/models/UserModel";
import { Merchant } from "../src/models/MerchantModel";
import { server, app } from "../src/server";
import UserService from "../src/services/userServices";
import MerchantService from "../src/services/merchantService";

app.use(express.json());
// app.use(express.json());

jest.mock("../src/services/userServices", () => ({
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
}));
jest.mock("../src/services/merchantService", () => ({
  createUser: jest.fn(),
  findMerchantByEmail: jest.fn(),
}));
const user = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  dateOfBirth: "1990-05-15",
  password: "SecurePassword123",
  address: "123 Main Street, Springfield, USA",
  role: "user",
};

const merch = {
  name: "John Doe",
  email: "john.zdzf@example.com",
  password: "securePassword123",
  businessName: "John's Coffee Shop",
  businessAddress: "123 Main Street, Springfield",
  dateOfBirth: "1990-10-10",
  phone: "+905340537088",
  role: "merchant",
};
describe("Testing sign up", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    next = jest.fn();
  });
  beforeEach(() => {
    // Reset all mock instances and calls before each test
    jest.clearAllMocks();
  });
  it("Should return 201 When user is created successfully", async () => {
    req = {
      body: { ...user },
    };
    (UserService.createUser as jest.Mock).mockResolvedValue({
      ...user,
      user_id: 1,
    });
    (UserService.findUserByEmail as jest.Mock).mockResolvedValue(null);

    (MerchantService.createUser as jest.Mock).mockResolvedValue({ ...merch });
    (MerchantService.findMerchantByEmail as jest.Mock).mockResolvedValue(null);

    await signUp(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("Should return 201 When merchant is created successfully", async () => {
    req = {
      body: { ...merch },
    };

    (MerchantService.createUser as jest.Mock).mockResolvedValue({
      ...merch,
      merchant_id: 1,
    });
    (MerchantService.findMerchantByEmail as jest.Mock).mockResolvedValue(null);

    await signUp(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("Should return 400 When there's invalid password field", async () => {
    req = {
      body: { ...merch, password: "bad" },
    };

    (MerchantService.createUser as jest.Mock).mockResolvedValue({
      ...merch,
      merchant_id: 1,
    });
    (MerchantService.findMerchantByEmail as jest.Mock).mockResolvedValue(null);

    await signUp(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("Should return 400 When there's invalid email field", async () => {
    req = {
      body: { ...merch, email: "bad" },
    };

    (MerchantService.createUser as jest.Mock).mockResolvedValue({
      ...merch,
      merchant_id: 1,
    });
    (MerchantService.findMerchantByEmail as jest.Mock).mockResolvedValue(null);

    await signUp(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("Should return 400 When there's invalid name field", async () => {
    req = {
      body: { ...merch, name: "bad" },
    };

    (MerchantService.createUser as jest.Mock).mockResolvedValue({
      ...merch,
      merchant_id: 1,
    });
    (MerchantService.findMerchantByEmail as jest.Mock).mockResolvedValue(null);

    await signUp(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("Should return 400 When there's invalid name field", async () => {
    req = {
      body: { ...merch, name: "bad" },
    };
    (MerchantService.findMerchantByEmail as jest.Mock).mockResolvedValue(true);

    (MerchantService.createUser as jest.Mock).mockResolvedValue(null);

    await signUp(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });
  afterAll(() => {
    server.close(); // Close the server after the tests have finished
  });
});
