const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  // 1. Get the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // 2. Extract the token — remove the "Bearer " prefix
  const token = authHeader.split(" ")[1];

  // 3. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the decoded payload to req so controllers can use it
    req.user = decoded;

    next();
  } catch (err) {
    // jwt.verify throws if token is invalid OR expired
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = authenticate;