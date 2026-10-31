const router = require("express").Router();
const { signup, login, me } = require("../controllers/authController");
const { fetchUser } = require("../middlewares/fetchUser");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", fetchUser, me);

module.exports = router;
