const mongoose = require("mongoose");
const path = require("path");

async function connectDB() {
  try {
    // Load variables from `lesson1/.env` (for local development).
    require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

    const uri =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/employeesDB";
    await mongoose.connect(uri);

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}

module.exports = connectDB;