const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { redisClient } = require("../config/redis");
const logger = require("../utils/logger");

// LIVENESS — is the server process alive?
// Simple ping — if this responds, the process is running
router.get("/live", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// READINESS — is the server ready to handle traffic?
// Checks all dependencies: MongoDB and Redis
router.get("/ready", async (req, res) => {
  const checks = {
    mongodb: false,
    redis: false,
  };

  // mongoose.connection.readyState values:
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  checks.mongodb = mongoose.connection.readyState === 1;

  // Check Redis by sending a PING command
  // If Redis responds, it's alive and connected
  try {
    const reply = await redisClient.ping();
    checks.redis = reply === "PONG";
  } catch (err) {
    logger.error("Redis health check failed", { error: err.message });
    checks.redis = false;
  }

  // Server is only ready if ALL checks pass
  const isReady = Object.values(checks).every((check) => check === true);

  const status = isReady ? "ok" : "degraded";
  const statusCode = isReady ? 200 : 503;

  // 503 = Service Unavailable — tells the platform to stop sending traffic
  res.status(statusCode).json({
    status,
    timestamp: new Date().toISOString(),
    checks,
  });
});

module.exports = router;