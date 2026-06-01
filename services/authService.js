const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ConflictError, UnauthorizedError } = require("../errors");

async function register(username, password, role) {
  const existingUser = await User.findOne({ username });
  if (existingUser) throw new ConflictError("Username already taken");

  const user = new User({ username, password, role });
  await user.save();

  return { id: user._id, username: user.username, role: user.role };
}

async function login(username, password) {
  const user = await User.findOne({ username });
  if (!user) throw new UnauthorizedError("Invalid credentials");

  const isValid = await user.comparePassword(password);
  if (!isValid) throw new UnauthorizedError("Invalid credentials");

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { token, role: user.role };
}

module.exports = { register, login };