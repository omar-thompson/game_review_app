// ─── Auth controller ─────────────────────────────────────────────────────────
// The actual logic behind each auth endpoint. routes/authRoutes.js just maps
// URLs to these functions — this is where the real work happens.
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; // sent as JSON from the frontend's fetch() call

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "An account with that email already exists" });
    }

    // User.create() triggers the pre("save") hook in models/User.js,
    // which hashes the password before it's actually written to MongoDB
    const user = await User.create({ name, email, password });

    generateToken(res, user._id); // signs a JWT and sets it as an httpOnly cookie on the response

    // Only send back safe fields — never the password hash
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Registration error:", error); // full details stay server-side
    res.status(500).json({ message: "Registration failed" }); // client only gets a generic message
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // matchPassword() compares the given password against the stored hash
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// POST /api/auth/logout
// Overwrites the jwt cookie with an empty, already-expired one — the
// browser then stops sending it, effectively "logging out"
const logoutUser = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out" });
};

// GET /api/auth/me — protected route (see routes/authRoutes.js, uses `protect`)
// req.user was already set by the protect middleware before this even runs.
// This is what the frontend calls on page load to check "am I still logged in?"
const getMe = (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};

module.exports = { registerUser, loginUser, logoutUser, getMe };
