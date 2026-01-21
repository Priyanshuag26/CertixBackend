// scripts/createAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../src/modules/auth/model");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await Admin.create({
    email: "priyanshuagrawal2004@gmail.com",
    password: hashedPassword,
  });

  console.log("Admin created");
  process.exit();
})();
