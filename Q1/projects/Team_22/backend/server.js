require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const { configureCORS } = require("./middleware/cors");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const {
  apiRateLimit,
  securityHeaders,
  requestLogger,
} = require("./middleware/security");

// Import routes
const courseRoutes = require("./routes/courses");
const sessionRoutes = require("./routes/sessions");
const questionRoutes = require("./routes/questions");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Trust proxy (important for rate limiting behind reverse proxies)
app.set("trust proxy", 1);

// Security headers
app.use(securityHeaders);

// Request logging
if (process.env.NODE_ENV === "development") {
  app.use(requestLogger);
}

// CORS configuration
app.use(configureCORS());

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
app.use("/api/", apiRateLimit);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "VidyaVichara API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/courses", courseRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to VidyaVichara API",
    description:
      "Classroom Q&A Sticky Board - Real-time question management for educational environments",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      courses: "/api/courses",
      sessions: "/api/sessions",
      questions: "/api/questions",
    },
    documentation: "See README.md for API documentation",
  });
});

// 404 handler - must be after all routes
app.use(notFound);

// Error handling middleware - must be last
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 VidyaVichara API Server is running!
📍 Environment: ${process.env.NODE_ENV || "development"}
🌐 URL: http://localhost:${PORT}
📊 Health Check: http://localhost:${PORT}/health
📚 API Base: http://localhost:${PORT}/api
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error("Unhandled Promise Rejection:", err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  console.error(err.stack);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});

module.exports = app;
