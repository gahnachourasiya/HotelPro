const mongoose = require("mongoose");

// No card details are stored here. Add a payment gateway (Stripe/Razorpay)
// later and keep only its payment id and status.
const bookingSchema = new mongoose.Schema(
  {
    roomid: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Snapshots, so history stays correct even if the room or user is edited
    roomNumber: { type: Number, required: true },
    roomType: { type: String, required: true },
    username: { type: String, required: true },
    phone: { type: String, required: true },
    fromdate: { type: Date, required: true }, // check-in (UTC midnight)
    todate: { type: Date, required: true }, // check-out (UTC midnight)
    totaldays: { type: Number, required: true }, // nights
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["booked", "cancelled"], default: "booked" },
  },
  { timestamps: true }
);

// Speeds up the overlap check
bookingSchema.index({ roomid: 1, status: 1, fromdate: 1, todate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
