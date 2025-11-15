const cors = require("cors");

/**
 * CORS configuration for development
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow all origins
    if (process.env.NODE_ENV === "development") {
      return callback(null, true);
    }

    // In production, specify allowed origins
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://your-production-domain.com",
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "X-Access-Token",
  ],
};

/**
 * Configure CORS middleware
 */
const configureCORS = () => {
  return cors(corsOptions);
};

module.exports = {
  configureCORS,
  corsOptions,
};
