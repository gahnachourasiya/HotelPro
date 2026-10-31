const router = require("express").Router();
const { allBookings, allUsers, stats } = require("../controllers/adminController");
const { fetchUser, isAdmin } = require("../middlewares/fetchUser");

router.use(fetchUser, isAdmin);

router.get("/bookings", allBookings);
router.get("/users", allUsers);
router.get("/stats", stats);

module.exports = router;
