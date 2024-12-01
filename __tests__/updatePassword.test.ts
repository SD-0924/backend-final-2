import { Request, Response, NextFunction } from "express";
import { updatePassword } from "../src/controllers/userController";
import UserService from "../src/services/userServices";
import bcrypt from "bcrypt";

// Mock the UserService and bcrypt to control behavior during tests
jest.mock("../src/services/userServices");
jest.mock("bcrypt");

interface CustomRequest extends Request {
  token?: {
    id: number;
  };
}

describe("User Controller - updatePassword", () => {
  let req: Partial<CustomRequest>;
  let res: Partial<Response>;
  let next: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  
  // Mock console.error to avoid noisy error messages during tests
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

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
  });

  it("should update the password successfully", async () => {
    req = {
      token: {
        id: 1,
      },
      body: {
        currentPassword: "oldPassword",
        newPassword: "newPassword",
        confirmPassword: "newPassword",
      },
    };

    // Mock the UserService.getUserById to return a user and bcrypt to verify password
    const userData = {
      user_id: 1,
      password: "hashedOldPassword",
    };
    (UserService.getUserById as jest.Mock).mockResolvedValue(userData);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (UserService.updateUserPassword as jest.Mock).mockResolvedValue(undefined);

    await updatePassword(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Password updated successfully.",
    });
  });

  it("should return 400 if passwords do not match", async () => {
    req = {
      token: {
        id: 1,
      },
      body: {
        currentPassword: "oldPassword",
        newPassword: "newPassword",
        confirmPassword: "differentPassword",
      },
    };

    await updatePassword(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Passwords do not match.",
    });
  });

  it("should return 404 if user is not found", async () => {
    req = {
      token: {
        id: 2,
      },
      body: {
        currentPassword: "oldPassword",
        newPassword: "newPassword",
        confirmPassword: "newPassword",
      },
    };

    (UserService.getUserById as jest.Mock).mockResolvedValue(null);

    await updatePassword(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "User not found.",
    });
  });

  it("should return 401 if current password is incorrect", async () => {
    req = {
      token: {
        id: 1,
      },
      body: {
        currentPassword: "wrongPassword",
        newPassword: "newPassword",
        confirmPassword: "newPassword",
      },
    };

    const userData = {
      user_id: 1,
      password: "hashedOldPassword",
    };
    (UserService.getUserById as jest.Mock).mockResolvedValue(userData);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await updatePassword(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Current password is incorrect.",
    });
  });

  it("should return 500 for internal server errors", async () => {
    req = {
      token: {
        id: 1,
      },
      body: {
        currentPassword: "oldPassword",
        newPassword: "newPassword",
        confirmPassword: "newPassword",
      },
    };

    (UserService.getUserById as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

    await updatePassword(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Internal server error.",
    });
  });


  //Rate limiting tests
  describe("Rate Limiting Tests for Password Update", () => {
    it("should return 429 if last password change was within 24 hours", async () => {
      req = {
        token: {
          id: 1,
        },
        body: {
          currentPassword: "oldPassword",
          newPassword: "newPassword",
          confirmPassword: "newPassword",
        },
      };

      // Mock the UserService.getUserById to return a user and bcrypt to verify password
      const userData = {
        user_id: 1,
        password: "hashedOldPassword",
        lastPasswordChange: new Date(), // Password changed just now
      };
      (UserService.getUserById as jest.Mock).mockResolvedValue(userData);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await updatePassword(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(429);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Password can only be changed once every 24 hours.",
      });
    });

    it("should update the password successfully if lastPasswordChange is more than 24 hours ago", async () => {
      req = {
        token: {
          id: 1,
        },
        body: {
          currentPassword: "oldPassword",
          newPassword: "newPassword",
          confirmPassword: "newPassword",
        },
      };

      // Mock the UserService.getUserById to return a user and bcrypt to verify password
      const userData = {
        user_id: 1,
        password: "hashedOldPassword",
        lastPasswordChange: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
      };
      (UserService.getUserById as jest.Mock).mockResolvedValue(userData);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (UserService.updateUserPassword as jest.Mock).mockResolvedValue(undefined);

      await updatePassword(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Password updated successfully.",
      });
    });

    it("should update the password successfully if lastPasswordChange is null", async () => {
      req = {
        token: {
          id: 1,
        },
        body: {
          currentPassword: "oldPassword",
          newPassword: "newPassword",
          confirmPassword: "newPassword",
        },
      };

      // Mock the UserService.getUserById to return a user and bcrypt to verify password
      const userData = {
        user_id: 1,
        password: "hashedOldPassword",
        lastPasswordChange: null, // No last password change recorded
      };
      (UserService.getUserById as jest.Mock).mockResolvedValue(userData);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (UserService.updateUserPassword as jest.Mock).mockResolvedValue(undefined);

      await updatePassword(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Password updated successfully.",
      });
    });
  });
});
