// ─── User (admin) controller ─────────────────────────────────────────────────
// All three of these are mounted behind protect + adminOnly in
// routes/userRoutes.js, so by the time any of these functions run, we
// already know req.user exists and is an admin.
const User = require("../models/User");

// GET /api/users — list every user (used by the Manage Users admin page)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("List users error:", error);
    res.status(500).json({ message: "Failed to load users" });
  }
};

// PUT /api/users/:id — edit a user's name/email/role
const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (role && !["gamer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'gamer' or 'admin'" });
    }

    // Only include fields that were actually sent, so a partial edit
    // doesn't accidentally wipe out the other fields
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email.toLowerCase();
    if (role) update.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,          // return the updated document, not the old one
      runValidators: true, // still enforce schema rules (e.g. required fields) on update
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    if (error.code === 11000) { // MongoDB's duplicate-key error code
      return res.status(400).json({ message: "An account with that email already exists" });
    }
    console.error("Update user error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// DELETE /api/users/:id — remove a user
const deleteUser = async (req, res) => {
  try {
    // Safety guard: an admin can't delete their own account, to avoid
    // accidentally locking themselves out of the admin panel
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = { getUsers, updateUser, deleteUser };
