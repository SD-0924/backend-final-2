import express from "express";
import { uploadImage } from "../controllers/uploadImageController";
import multer from "multer";
import { upload } from "../middleware/multer";

export const imageRouter = express.Router();

imageRouter.post("/upload", upload.single("image"), uploadImage);
