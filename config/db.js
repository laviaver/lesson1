const mongoose = require("mongoose");
const path = require("path");
const logger = require("../utils/logger");

async function connectDB() {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

  const atlasUri = process.env.MONGODB_ATLAS_URI;
  const localUri = process.env.MONGODB_LOCAL_URI || "mongodb://127.0.0.1:27017/employeesDB";

  if (atlasUri) {
    try {
      await mongoose.connect(atlasUri, { serverSelectionTimeoutMS: 5000 });
      logger.info("MongoDB connected (Atlas)");
      return;
    } catch (err) {
      logger.warn("Atlas connection failed, falling back to local DB", {
        error: err.message,
      });
    }
  }

  try {
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 5000 });
    logger.info("MongoDB connected (Local)");
  } catch (err) {
    logger.error("MongoDB connection failed", {
      error: err.message,
      stack: err.stack,
    });
    process.exit(1);
  }
}

module.exports = connectDB;