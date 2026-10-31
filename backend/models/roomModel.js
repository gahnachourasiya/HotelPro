const mongoose = require("mongoose");

// One document = one physical room.
const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: Number, required: true, unique: true, min: 1 },
    capacity: { type: Number, required: true, min: 1 },
    rent: { type: Number, required: true, min: 1 }, // price per night in INR
    type: { type: String, enum: ["deluxe", "standard"], required: true },
    photos: [{ type: String, trim: true }],
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
