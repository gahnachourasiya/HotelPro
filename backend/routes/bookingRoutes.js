const router = require("express").Router();
const {
  createBooking,
  myBookings,
  cancelBooking,
} = require("../controllers/bookingController");
const { fetchUser } = require("../middlewares/fetchUser");

router.post("/", fetchUser, createBooking);
router.get("/my", fetchUser, myBookings);
router.post("/:id/cancel", fetchUser, cancelBooking);

module.exports = router;
