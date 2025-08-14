const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initializeDatabase } = require("./database");
const brixRoutes = require("./routes/brix");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
  // Allow Vercel deployments
  /^https:\/\/.*\.vercel\.app$/,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list
      if (
        allowedOrigins.some((allowed) => {
          if (typeof allowed === "string") {
            return allowed === origin;
          }
          if (allowed instanceof RegExp) {
            return allowed.test(origin);
          }
          return false;
        })
      ) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/brix", brixRoutes);
app.use("/api/auth", authRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Soil Dashboard API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      brix: {
        readings: "/api/brix/readings",
        plants: "/api/brix/plants",
        stats: "/api/brix/stats",
      },
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}`);
      console.log(`🏥 Health check at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
