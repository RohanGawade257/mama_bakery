import Setting from "../models/Setting.js";
import { uploadBufferToCloudinary } from "../config/cloudinary.js";

const getOrCreateSettings = async () => {
  let settings = await Setting.findOne({ singletonKey: "global" });
  if (!settings) {
    settings = await Setting.create({ singletonKey: "global" });
  }
  return settings;
};

const sanitizeString = (value) => (typeof value === "string" ? value.trim() : "");

export const getPublicSettings = async (_req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    res.json({
      data: {
        upi: {
          enabled: settings.upi.enabled,
          upiId: settings.upi.upiId,
          phone: settings.upi.phone,
          qrImage: settings.upi.qrImage,
          instructions: settings.upi.instructions
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminSettings = async (_req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateUPISettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    if (req.body.enabled !== undefined) {
      settings.upi.enabled = String(req.body.enabled) === "true" || req.body.enabled === true;
    }

    if (req.body.upiId !== undefined) {
      settings.upi.upiId = sanitizeString(req.body.upiId);
    }

    if (req.body.phone !== undefined) {
      settings.upi.phone = sanitizeString(req.body.phone);
    }

    if (req.body.instructions !== undefined) {
      settings.upi.instructions = sanitizeString(req.body.instructions);
    }

    if (req.file) {
      const upload = await uploadBufferToCloudinary(req.file.buffer, "mama-bakery/upi");
      settings.upi.qrImage = upload.secure_url;
    }

    await settings.save();
    res.json({ data: settings, message: "UPI settings updated successfully." });
  } catch (error) {
    next(error);
  }
};
