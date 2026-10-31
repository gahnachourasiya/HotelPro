const User = require("../models/userModel");
const Room = require("../models/roomModel");
const Booking = require("../models/bookingModel");

exports.allBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.send(bookings);
  } catch (error) {
    console.error("allBookings error:", error);
    res.status(500).send({ msg: "Could not load bookings" });
  }
};

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.send(users);
  } catch (error) {
    console.error("allUsers error:", error);
    res.status(500).send({ msg: "Could not load users" });
  }
};

exports.stats = async (req, res) => {
  try {
    const [users, rooms, active, revenue] = await Promise.all([
      User.countDocuments(),
      Room.countDocuments(),
      Booking.countDocuments({ status: "booked" }),
      Booking.aggregate([
        { $match: { status: "booked" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);
    res.send({ users, rooms, activeBookings: active, revenue: revenue[0]?.total || 0 });
  } catch (error) {
    console.error("stats error:", error);
    res.status(500).send({ msg: "Could not load stats" });
  }
};
