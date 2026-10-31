const mongoose = require("mongoose");
const Room = require("../models/roomModel");
const Booking = require("../models/bookingModel");
const { parseDay, todayUTC, nightsBetween } = require("../utils/dates");

// POST /api/bookings   body: { roomid, fromdate, todate }  (dates as YYYY-MM-DD)
// Nights and the total are calculated here, never trusted from the client.
exports.createBooking = async (req, res) => {
  try {
    const { roomid, fromdate, todate } = req.body;

    if (!mongoose.isValidObjectId(roomid))
      return res.status(400).send({ msg: "Invalid room" });

    const from = parseDay(fromdate);
    const to = parseDay(todate);
    if (!from || !to) return res.status(400).send({ msg: "Choose valid dates" });
    if (from < todayUTC())
      return res.status(400).send({ msg: "Check-in cannot be in the past" });

    const nights = nightsBetween(from, to);
    if (nights < 1)
      return res.status(400).send({ msg: "Check-out must be after check-in" });

    const room = await Room.findById(roomid);
    if (!room) return res.status(404).send({ msg: "Room not found" });

    // Overlap check: an existing booking clashes if it starts before the new
    // stay ends AND ends after the new stay starts. Same-day turnover is allowed.
    const clash = await Booking.findOne({
      roomid: room._id,
      status: "booked",
      fromdate: { $lt: to },
      todate: { $gt: from },
    });
    if (clash)
      return res.status(409).send({ msg: "This room is not available for the selected dates" });

    const booking = await Booking.create({
      roomid: room._id,
      userid: req.user._id,
      roomNumber: room.roomNumber,
      roomType: room.type,
      username: req.user.name,
      phone: req.user.phone,
      fromdate: from,
      todate: to,
      totaldays: nights,
      totalAmount: nights * room.rent,
    });

    res.status(201).send(booking);
  } catch (error) {
    console.error("createBooking error:", error);
    res.status(500).send({ msg: "Could not create booking" });
  }
};

// GET /api/bookings/my
exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userid: req.user._id }).sort({ createdAt: -1 });
    res.send(bookings);
  } catch (error) {
    console.error("myBookings error:", error);
    res.status(500).send({ msg: "Could not load bookings" });
  }
};

// POST /api/bookings/:id/cancel   (owner, or an admin)
exports.cancelBooking = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).send({ msg: "Invalid booking id" });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).send({ msg: "Booking not found" });

    const isOwner = String(booking.userid) === String(req.user._id);
    const isAdminUser = req.user.userType === "admin";
    if (!isOwner && !isAdminUser)
      return res.status(403).send({ msg: "You can only cancel your own bookings" });

    if (booking.status === "cancelled")
      return res.status(400).send({ msg: "Booking is already cancelled" });

    if (!isAdminUser && booking.fromdate < todayUTC())
      return res
        .status(400)
        .send({ msg: "A stay that has already started cannot be cancelled online" });

    booking.status = "cancelled";
    await booking.save();
    res.send(booking);
  } catch (error) {
    console.error("cancelBooking error:", error);
    res.status(500).send({ msg: "Could not cancel booking" });
  }
};
