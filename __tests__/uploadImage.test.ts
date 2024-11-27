import { Request, Response } from "express";
import { uploadImage } from "../src/controllers/uploadImageController";
import cloudinary from "../src/utils/cloudinryConfig";

// Mock Cloudinary's uploader
jest.mock("../src/utils/cloudinryConfig", () => ({
  uploader: {
    upload: jest.fn(),
  },
}));

describe("Upload Image Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();

    // Setup mock response
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it("should successfully upload an image", async () => {
    // Prepare mock request
    mockRequest = {
      file: { path: "path/to/image.jpg" } as Express.Multer.File,
    };

    // Mock Cloudinary's upload response
    const mockUploadResult = {
      public_id: "image_public_id",
      url: "http://cloudinary.com/image.jpg",
    };
    (cloudinary.uploader.upload as jest.Mock).mockResolvedValue(
      mockUploadResult
    );

    // Call the controller
    await uploadImage(
      mockRequest as Request,
      mockResponse as Response,
      jest.fn()
    );

    // Assertions
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
      "path/to/image.jpg"
    );
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: "Image uploaded successfully",
      data: mockUploadResult,
    });
  });

  it("should return 500 if no file is provided", async () => {
    // Prepare mock request with no file
    mockRequest = {};

    // Call the controller
    await uploadImage(
      mockRequest as Request,
      mockResponse as Response,
      jest.fn()
    );

    // Assertions
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "no file provided",
    });
  });

  it("should handle Cloudinary upload errors", async () => {
    // Prepare mock request
    mockRequest = {
      file: { path: "path/to/image.jpg" } as Express.Multer.File,
    };

    // Mock Cloudinary's upload to throw an error
    const mockError = new Error("Cloudinary upload failed");
    (cloudinary.uploader.upload as jest.Mock).mockRejectedValue(mockError);

    // Call the controller
    await uploadImage(
      mockRequest as Request,
      mockResponse as Response,
      jest.fn()
    );

    // Assertions
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
      "path/to/image.jpg"
    );
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Cloudinary upload failed",
    });
  });
});
