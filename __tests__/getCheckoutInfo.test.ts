import { Request, Response, NextFunction } from "express";
import { getCheckoutInfo } from "../src/controllers/checkoutController";
import UserService from "../src/services/userServices";
// Mock UserService
jest.mock("../src/services/userServices");

interface CustomRequest extends Request {
  token?: { id: number };
}

describe("Checkout Controller - getCheckoutInfo", () => {
  let req: Partial<CustomRequest>;
  let res: Partial<Response>;
  let next: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    res = { status: statusMock, json: jsonMock };
    next = jest.fn();
  });

  it("should retrieve address successfully", async () => {
    req = { token: { id: 1 } };

    const userData = {
      user_id: 1,
      firstName: "John",
      lastName: "Doe",
      phone: "+123456789",
      address: "123 Main St",
    };
    (UserService.getUserById as jest.Mock).mockResolvedValue(userData);

    await getCheckoutInfo(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      phone: "+123456789",
      address: "123 Main St",
    });
  });

  it("should return 404 if user is not found", async () => {
    req = { token: { id: 2 } };

    (UserService.getUserById as jest.Mock).mockResolvedValue(null);

    await getCheckoutInfo(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: "User not found." });
  });

  it("should return 500 for internal server errors", async () => {
    req = { token: { id: 1 } };

    (UserService.getUserById as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

    await getCheckoutInfo(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Internal server error." });
  });
});
