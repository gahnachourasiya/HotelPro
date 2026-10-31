const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: (process.env.CLIENT_URL || "http://localhost:5173").split(","),
  })
);

app.get("/api/health", (req, res) => res.send({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => res.status(404).send({ msg: "Route not found" }));

// Last-resort handler: never leak internals to the client
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
