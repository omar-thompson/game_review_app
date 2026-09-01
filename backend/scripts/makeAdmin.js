// Promotes an existing user to the admin role. Usage:
//   node scripts/makeAdmin.js someone@example.com
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/makeAdmin.js <email>");
  process.exit(1);
}

(async () => {
  await connectDB();

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { role: "admin" },
    { returnDocument: "after" }
  );

  if (!user) {
    console.error(`No user found with email ${email}`);
  } else {
    console.log(`${user.email} is now an admin.`);
  }

  await mongoose.connection.close();
  process.exit(user ? 0 : 1);
})();
