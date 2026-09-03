// ─── User model ──────────────────────────────────────────────────────────────
// A Mongoose "schema" defines the shape of a document in MongoDB — what
// fields exist, their types, and validation rules. mongoose.model() then
// turns that schema into a usable class (User) with methods like
// .create(), .find(), .findById() etc. that actually talk to the database.
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // MongoDB will reject a second user with the same email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // stores the HASHED password, never plaintext (see hook below)
    },
    role: {
      type: String,
      enum: ["gamer", "admin"], // only these two values are allowed
      default: "gamer",
    },
  },
  { timestamps: true } // auto-adds createdAt / updatedAt fields
);

// Runs automatically right before any User document is saved (both on
// User.create() and on .save()). Only re-hashes the password if it was
// actually changed — so updating someone's name doesn't re-hash it again.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// An "instance method" — callable on any user document you've fetched,
// e.g. user.matchPassword("theirGuess"). Compares a plaintext guess
// against the stored hash without ever exposing the hash itself.
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
