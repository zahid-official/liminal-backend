import { v2 as cloudinary } from "cloudinary";
import envVars from "./index.js";
import AppError from "../error/AppError.js";
import { httpStatus } from "../import/index.js";

// Configure cloudinary
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
  api_key: envVars.CLOUDINARY.API_KEY,
  api_secret: envVars.CLOUDINARY.API_SECRET,
});

// Function to delete image from cloudinary
export const cloudinaryDelete = async (imageURL: string): Promise<void> => {
  try {
    // If no image URL is provided, return early
    if (!imageURL) return;

    // Extract public ID from the image URL
    const parts = imageURL.split("/"); // Split the URL into array
    const fileNameWithExtention = parts.pop(); // Get the last element of the array which is the file name with extension
    const folderName = parts.pop(); // Get the last element of the array which is now the folder name after popping the file
    const publicIdWithoutExtention = fileNameWithExtention?.split(".")[0]; // Remove the file extension to get the public ID

    // Construct the public ID with folder if folder exists
    const publicId = folderName
      ? `${folderName}/${publicIdWithoutExtention}`
      : publicIdWithoutExtention;

    // Delete the image from cloudinary using the public ID
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error?.message || "Failed to delete image from Cloudinary",
    );
  }
};

export default cloudinary;
