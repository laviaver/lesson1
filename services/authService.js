const jwt = require("jsonwebtoken");
const User = require("../models/User");

// CREATE A NEW USER ACCOUNT
async function register(username, password, role) {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    const error = new Error("Username already taken");
    error.status = 409; // 409 Conflict — resource already exists
    throw error;
  }

  // Password gets hashed automatically by the model hook
  const user = new User({ username, password, role });
  await user.save();

  // Never return the password — not even the hashed version
  return { id: user._id, username: user.username, role: user.role };
}

// VERIFY CREDENTIALS AND RETURN A TOKEN
async function login(username, password) {
  const user = await User.findOne({ username });
  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { token, role: user.role };
}

module.exports = { register, login };