const express = require("express");
const { getReviewsForGame, getMyReviews, createReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getReviewsForGame); // public — GET /api/reviews?game=0
router.get("/mine", protect, getMyReviews); // must be logged in
router.post("/", protect, createReview); // must be logged in

module.exports = router;
