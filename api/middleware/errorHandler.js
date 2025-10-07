import { AppError } from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack || err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Fallback for unexpected errors
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
  });
};
