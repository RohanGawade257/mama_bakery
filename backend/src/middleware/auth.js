import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      const error = new Error("Not authorized. Missing token.");
      error.statusCode = 401;
      throw error;
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      const error = new Error("Not authorized. User not found.");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 401;
    }

    if (error.name === "TokenExpiredError") {
      error.message = "Session expired. Please login again.";
    } else if (error.name === "JsonWebTokenError") {
      error.message = "Invalid authentication token.";
    }

    next(error);
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    const error = new Error("Admin access required.");
    error.statusCode = 403;
    next(error);
    return;
  }

  next();
};
