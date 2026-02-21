import { uploadBufferToCloudinary } from "../config/cloudinary.js";

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("Image file is required.");
      error.statusCode = 400;
      throw error;
    }

    if (!req.file.buffer || req.file.buffer.length === 0) {
      const error = new Error("Uploaded file buffer is empty.");
      error.statusCode = 400;
      throw error;
    }

    const rawFolder = typeof req.body.folder === "string" ? req.body.folder.trim() : "";
    const folder = (rawFolder || "mama-bakery/products").replace(/[^a-zA-Z0-9/_-]/g, "");
    const upload = await uploadBufferToCloudinary(req.file.buffer, folder || "mama-bakery/products");

    res.status(201).json({
      data: {
        url: upload.secure_url,
        publicId: upload.public_id
      },
      message: "Image uploaded successfully."
    });
  } catch (error) {
    next(error);
  }
};
