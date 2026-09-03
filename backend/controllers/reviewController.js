// ─── Review controller ────────────────────────────────────────────────────────
// Reviews link a User to a game via a plain numeric id (the game data itself
// lives in the static frontend/src/data/games.js file, not in MongoDB — see
// models/Review.js for why).
const Review = require("../models/Review");

// GET /api/reviews?game=<id> — public, returns all reviews for one game
const getReviewsForGame = async (req, res) => {
  try {
    const { game } = req.query; // query string params (?game=0) land in req.query

    if (game === undefined) {
      return res.status(400).json({ message: "A game id is required" });
    }

    // .populate("user", "name") replaces the raw user ObjectId with the
    // actual user document (just the name field), so the frontend doesn't
    // need a second request to know who wrote each review
    const reviews = await Review.find({ game: Number(game) })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("List reviews error:", error);
    res.status(500).json({ message: "Failed to load reviews" });
  }
};

// GET /api/reviews/mine — protected, returns the logged-in user's own reviews
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("List my reviews error:", error);
    res.status(500).json({ message: "Failed to load your reviews" });
  }
};

// POST /api/reviews — protected, creates a review as the logged-in user
const createReview = async (req, res) => {
  try {
    const { game, score, body } = req.body;

    if (game === undefined || score === undefined || !body) {
      return res.status(400).json({ message: "game, score and body are required" });
    }

    const review = await Review.create({
      game: Number(game),
      user: req.user._id,
      score,
      body,
    });

    const populated = await review.populate("user", "name");

    res.status(201).json(populated);
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ message: "Failed to create review" });
  }
};

module.exports = { getReviewsForGame, getMyReviews, createReview };
