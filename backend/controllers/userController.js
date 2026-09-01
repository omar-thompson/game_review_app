const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("List users error:", error);
    res.status(500).json({ message: "Failed to load users" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (role && !["gamer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'gamer' or 'admin'" });
    }

    const update = {};
    if (name) update.name = name;
    if (email) update.email = email.toLowerCase();
    if (role) update.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "An account with that email already exists" });
    }
    console.error("Update user error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  try {
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
