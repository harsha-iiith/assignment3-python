const rateLimit = require("express-rate-limit");
const { HTTP_STATUS } = require("../utils/constants");

/**
 * Rate limiting for question posting
 * Prevents spam by limiting questions per student
 */
const questionRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Maximum 5 questions per minute per IP
  message: {
    success: false,
    message:
      "Too many questions posted. Please wait before posting another question.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key generator to rate limit per student name + IP
  keyGenerator: (req) => {
    return `${req.ip}-${req.body.studentName || "unknown"}`;
  },
});

/**
 * General API rate limiting
 */
const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased to 500 requests per 15 minutes per IP (for development/testing)
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiting for session creation
 */
const sessionRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Maximum 3 session creations per minute per IP
  message: {
    success: false,
    message:
      "Too many session creation attempts. Please wait before creating another session.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Security headers middleware
 */
const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  next();
};

/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logMessage = `${new Date().toISOString()} - ${req.method} ${
      req.originalUrl
    } - ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 400) {
      console.error(logMessage);
    } else {
      console.log(logMessage);
    }
  });

  next();
};

module.exports = {
  questionRateLimit,
  apiRateLimit,
  sessionRateLimit,
  securityHeaders,
  requestLogger,
};
