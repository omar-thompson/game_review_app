const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    game: {
      type: Number, // matches the static game "id" field in frontend/src/data/games.js
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
