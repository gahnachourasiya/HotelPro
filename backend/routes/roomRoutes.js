const router = require("express").Router();
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");
const { fetchUser, isAdmin } = require("../middlewares/fetchUser");

// Public
router.get("/", getRooms);
router.get("/:id", getRoom);

// Admin only
router.post("/", fetchUser, isAdmin, createRoom);
router.put("/:id", fetchUser, isAdmin, updateRoom);
router.delete("/:id", fetchUser, isAdmin, deleteRoom);

module.exports = router;
