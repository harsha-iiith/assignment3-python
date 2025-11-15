const { HTTP_STATUS } = require("../utils/constants");

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error to console
  console.error("Error:", err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Invalid ID format";
    error = { message, statusCode: HTTP_STATUS.BAD_REQUEST };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value for ${field}`;
    error = { message, statusCode: HTTP_STATUS.CONFLICT };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = { message, statusCode: HTTP_STATUS.BAD_REQUEST };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = { message, statusCode: HTTP_STATUS.UNAUTHORIZED };
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = { message, statusCode: HTTP_STATUS.UNAUTHORIZED };
  }

  res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * Handle async errors
 * @param {Function} fn - Async function
 * @returns {Function} - Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Handle 404 - Route not found
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: error.message,
  });
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFound,
};
