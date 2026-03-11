import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import type { Request } from "express";

// Configure multer-storage to use cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    // Generate file name
    const fileName = file.originalname
      .split(".")
      .slice(0, -1)
      .join(".")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "");

    // Return the unique file name
    const uniqueFileName =
      Math.random().toString(36).substring(2) +
      "-" +
      Date.now() +
      "-" +
      fileName;

    return {
      folder: "liminalImages",
      public_id: uniqueFileName,
      resource_type: "auto",
    };
  },
});

// Initialize multer with the cloudinary storage
const multerUpload = multer({ storage: storage });
export default multerUpload;
