// Run with:  npm run seed
// Creates the first admin account and a few sample rooms (only if there are none).
require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Room = require("../models/roomModel");

const sampleRooms = [
  { roomNumber: 101, capacity: 2, rent: 1200, type: "deluxe", description: "Deluxe room with city view and king bed" },
  { roomNumber: 102, capacity: 2, rent: 1200, type: "deluxe", description: "Deluxe room with balcony" },
  { roomNumber: 103, capacity: 3, rent: 1500, type: "deluxe", description: "Spacious deluxe room with sofa" },
  { roomNumber: 201, capacity: 2, rent: 900, type: "standard", description: "Comfortable standard room" },
  { roomNumber: 202, capacity: 4, rent: 1100, type: "standard", description: "Standard family room with two beds" },
].map((r) => ({
  ...r,
  photos: [`https://picsum.photos/seed/hotelpro-${r.roomNumber}/800/500`],
}));

(async () => {
  try {
    if (!process.env.MONGODB_CONNECTION_LINK) throw new Error("MONGODB_CONNECTION_LINK is missing in .env");
    await mongoose.connect(process.env.MONGODB_CONNECTION_LINK);

    const email = (process.env.ADMIN_EMAIL || "admin@hotelpro.com").toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "Admin@123";

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`Admin already exists: ${email}`);
    } else {
      await User.create({
        name: process.env.ADMIN_NAME || "Admin",
        email,
        password: await bcrypt.hash(password, 10),
        phone: "9999999999",
        userType: "admin",
      });
      console.log(`Admin created: ${email}  (password from ADMIN_PASSWORD in .env)`);
    }

    if ((await Room.countDocuments()) === 0) {
      await Room.insertMany(sampleRooms);
      console.log(`Added ${sampleRooms.length} sample rooms`);
    } else {
      console.log("Rooms already exist, skipping sample rooms");
    }
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
