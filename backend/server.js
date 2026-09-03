// ─── Server entry point ─────────────────────────────────────────────────────
// This is where the Express app is assembled: middleware, routes, static
// file serving, DB connection, and finally starting the server listening.
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

dotenv.config(); // loads .env into process.env (MONGO_URI, PORT, JWT_SECRET)

const app = express();

const PORT = process.env.PORT || 5001;

// Middleware — every request passes through these, in order, before
// reaching any route below
app.use(cors());
app.use(express.json());   // parses JSON request bodies into req.body
app.use(cookieParser());   // parses cookies into req.cookies (used by authMiddleware)

// Serves the built React app (frontend/dist) as static files — this is why
// production doesn't need a separate frontend server, Express does both jobs
app.use(express.static("../frontend/dist"));

// Route groups — each of these files maps specific paths/methods to
// controller functions. e.g. authRoutes handles everything under /api/auth/*
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/api", (req, res)=> {
  res.send("Game Review API is running!");
});

// Catch-all for the root URL: send back the React app's index.html, which
// then loads the built JS and takes over rendering client-side
app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: "../frontend/dist",
  });
});

connectDB(); // connect to MongoDB (see config/db.js)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
