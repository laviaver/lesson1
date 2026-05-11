const mongoose = require("mongoose");
const path = require("path");

async function connectDB() {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

  const atlasUri = process.env.MONGODB_ATLAS_URI;
  const localUri = process.env.MONGODB_LOCAL_URI || "mongodb://127.0.0.1:27017/employeesDB";

  if (atlasUri) {
    try {
      await mongoose.connect(atlasUri, { serverSelectionTimeoutMS: 5000 });
      console.log("MongoDB connected successfully (Atlas)");
      return;
    } catch (err) {
      console.warn("Atlas connection failed, falling back to local DB...");
    }
  }

  try {
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected successfully (Local)");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}

module.exports = connectDB;