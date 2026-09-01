const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(express.static("../frontend/dist"));

app.use("/api/auth", authRoutes);

app.get("/api", (req, res)=> {
  res.send("Game Review API is running!");
});

app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: "../frontend/dist",
  });
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
