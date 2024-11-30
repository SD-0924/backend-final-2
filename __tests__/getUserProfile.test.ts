import { Request, Response, NextFunction } from "express";
import { getUserProfile } from "../src/controllers/userController";
import UserService from "../src/services/userServices";

// Mock the UserService to control its behavior during tests
jest.mock("../src/services/userServices");

interface CustomRequest extends Request {
  token?: {
    id: number;
  };
}

describe("User Controller - getUserProfile", () => {
  let req: Partial<CustomRequest>;
  let res: Partial<Response>;
  let next: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock response
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    res = {
      status: statusMock,
      json: jsonMock,
    };
    next = jest.fn();

    // Mock console.error to prevent logging during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore console.error after all tests are run
    (console.error as jest.Mock).mockRestore();
  });

  it("should return user profile successfully", async () => {
    // Setup request
    req = {
      token: {
        id: 1,
      },
    };

    // Mock the UserService.getUserById to return a user
    const userData = {
      user_id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      dateOfBirth: "2000-01-01",
    };
    (UserService.getUserById as jest.Mock).mockResolvedValue(userData);

    // Call getUserProfile
    await getUserProfile(req as Request, res as Response, next);

    // Assert the status and response
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      id: userData.user_id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      dateOfBirth: userData.dateOfBirth,
    });
  });

  it("should return 404 when user is not found", async () => {
    req = {
      token: {
        id: 2,
      },
    };

    // Mock UserService.getUserById to throw an error simulating user not found
    (UserService.getUserById as jest.Mock).mockResolvedValue(null) ;

    await getUserProfile(req as Request, res as Response, next);

    // Assert 404 status
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "User not found.",
    });
  });

  it("should return 500 for internal server errors", async () => {
    req = {
      token: {
        id: 1,
      },
    };

    // Mock UserService.getUserById to throw an unexpected error
    (UserService.getUserById as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

    await getUserProfile(req as Request, res as Response, next);

    // Assert 500 status
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Internal server error.",
    });
  });
});
