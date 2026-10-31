const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, "Password is required"] },
    // String, not Number: keeps leading zeros and "+91"
    phone: { type: String, required: [true, "Phone is required"], trim: true },
    // The role is never taken from the signup form. Admins come from the seed script.
    userType: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
