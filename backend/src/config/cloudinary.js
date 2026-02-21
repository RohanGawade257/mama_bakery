import { v2 as cloudinary } from "cloudinary";

const readCloudinaryEnv = () => ({
  cloudName: process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME || "",
  apiKey: process.env.CLOUDINARY_KEY || process.env.CLOUDINARY_API_KEY || "",
  apiSecret: process.env.CLOUDINARY_SECRET || process.env.CLOUDINARY_API_SECRET || ""
});

let configuredFingerprint = "";

const ensureCloudinaryConfigured = () => {
  const { cloudName, apiKey, apiSecret } = readCloudinaryEnv();

  if (!cloudName || !apiKey || !apiSecret) {
    const error = new Error("Cloudinary environment variables are missing.");
    error.statusCode = 500;
    throw error;
  }

  const nextFingerprint = `${cloudName}:${apiKey}:${apiSecret}`;
  if (configuredFingerprint !== nextFingerprint) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });
    configuredFingerprint = nextFingerprint;
  }

  return { cloudName, apiKey, apiSecret };
};

export const getCloudinaryEnvStatus = () => {
  const { cloudName, apiKey, apiSecret } = readCloudinaryEnv();

  return {
    hasPreferred: Boolean(
      process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_KEY && process.env.CLOUDINARY_SECRET
    ),
    hasLegacy: Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    ),
    hasResolvedValues: Boolean(cloudName && apiKey && apiSecret)
  };
};

export const uploadBufferToCloudinary = (buffer, folder = "mama-bakery") =>
  new Promise((resolve, reject) => {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      const error = new Error("Image buffer is missing or invalid.");
      error.statusCode = 400;
      reject(error);
      return;
    }

    try {
      ensureCloudinaryConfigured();
    } catch (error) {
      reject(error);
      return;
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    stream.end(buffer);
  });

export default cloudinary;
