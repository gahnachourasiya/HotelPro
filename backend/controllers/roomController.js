const mongoose = require("mongoose");
const Room = require("../models/roomModel");
const Booking = require("../models/bookingModel");
const { parseDay, todayUTC, nightsBetween } = require("../utils/dates");

const TYPES = ["deluxe", "standard"];

// Picks only the allowed fields (no mass assignment) and validates them.
function parseRoomBody(body, partial = false) {
  const out = {};
  const errors = [];

  if (!partial || body.roomNumber !== undefined) {
    const n = Number(body.roomNumber);
    if (!Number.isInteger(n) || n < 1) errors.push("Room number must be a whole number");
    else out.roomNumber = n;
  }
  if (!partial || body.capacity !== undefined) {
    const n = Number(body.capacity);
    if (!Number.isInteger(n) || n < 1) errors.push("Capacity must be at least 1");
    else out.capacity = n;
  }
  if (!partial || body.rent !== undefined) {
    const n = Number(body.rent);
    if (!(n > 0)) errors.push("Rent per night must be greater than 0");
    else out.rent = n;
  }
  if (!partial || body.type !== undefined) {
    if (!TYPES.includes(body.type)) errors.push("Room type must be deluxe or standard");
    else out.type = body.type;
  }
  if (!partial || body.description !== undefined) {
    if (!body.description || !String(body.description).trim())
      errors.push("Description is required");
    else out.description = String(body.description).trim();
  }
  if (!partial || body.photos !== undefined) {
    const photos = Array.isArray(body.photos) ? body.photos : [];
    out.photos = photos.map((p) => String(p).trim()).filter(Boolean);
  }
  return { data: out, errors };
}

// GET /api/rooms?type=deluxe&fromdate=2026-10-20&todate=2026-10-22
// With dates, every room gets an "available" flag for that range.
exports.getRooms = async (req, res) => {
  try {
    const { type, fromdate, todate } = req.query;
    const filter = {};
    if (type) filter.type = type;

    const rooms = await Room.find(filter).sort({ roomNumber: 1 }).lean();

    if (fromdate || todate) {
      const from = parseDay(fromdate);
      const to = parseDay(todate);
      if (!from || !to || nightsBetween(from, to) < 1)
        return res.status(400).send({ msg: "Choose a valid check-in and check-out date" });

      const clashes = await Booking.find({
        status: "booked",
        fromdate: { $lt: to },
        todate: { $gt: from },
      }).select("roomid");
      const taken = new Set(clashes.map((b) => String(b.roomid)));
      rooms.forEach((r) => {
        r.available = !taken.has(String(r._id));
      });
    }

    res.send(rooms);
  } catch (error) {
    console.error("getRooms error:", error);
    res.status(500).send({ msg: "Could not load rooms" });
  }
};

exports.getRoom = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).send({ msg: "Invalid room id" });
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).send({ msg: "Room not found" });
    res.send(room);
  } catch (error) {
    res.status(500).send({ msg: "Could not load room" });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { data, errors } = parseRoomBody(req.body);
    if (errors.length) return res.status(400).send({ msg: errors[0] });

    const room = await Room.create(data);
    res.status(201).send(room);
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).send({ msg: "A room with this number already exists" });
    console.error("createRoom error:", error);
    res.status(500).send({ msg: "Could not add room" });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).send({ msg: "Invalid room id" });
    const { data, errors } = parseRoomBody(req.body, true);
    if (errors.length) return res.status(400).send({ msg: errors[0] });

    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).send({ msg: "Room not found" });

    Object.assign(room, data);
    await room.save();
    res.send(room);
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).send({ msg: "A room with this number already exists" });
    console.error("updateRoom error:", error);
    res.status(500).send({ msg: "Could not update room" });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).send({ msg: "Invalid room id" });
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).send({ msg: "Room not found" });

    const upcoming = await Booking.countDocuments({
      roomid: room._id,
      status: "booked",
      todate: { $gte: todayUTC() },
    });
    if (upcoming > 0)
      return res
        .status(409)
        .send({ msg: "This room has active or upcoming bookings. Cancel them first." });

    await room.deleteOne();
    res.send({ msg: "Room deleted" });
  } catch (error) {
    console.error("deleteRoom error:", error);
    res.status(500).send({ msg: "Could not delete room" });
  }
};
