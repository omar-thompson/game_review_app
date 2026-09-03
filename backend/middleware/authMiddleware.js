// ─── Auth middleware ─────────────────────────────────────────────────────────
// "Middleware" = a function that runs BEFORE the actual route handler, with
// the power to either call next() (let the request continue) or respond
// directly and stop it there (e.g. reject with 401/403).
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Use on any route that requires being logged in.
// Reads the jwt cookie → verifies it → looks up the user it belongs to →
// attaches it as req.user so the actual route handler can use it.
const protect = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if invalid/expired/tampered
    req.user = await User.findById(decoded.userId).select("-password"); // never attach the password hash

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    next(); // token is valid — let the request continue to the actual route
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// Use AFTER protect on any route that requires being an admin specifically.
// Relies on req.user already being set by protect.
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Not authorized as an admin" });
  }
  next();
};

module.exports = { protect, adminOnly };
