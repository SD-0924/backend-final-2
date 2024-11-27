import { Request, Response, NextFunction } from "express";
import cloudinary from "../utils/cloudinryConfig";

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file || !req.file.path) {
      throw new Error("no file provided");
    }

    //upload image to cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path);

    // Send success response
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: uploadResult,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "An error occurred while uploading the image.",
    });
  }
};
