const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Verifies the JWT and loads the user from the database, so a role change
// or a deleted account takes effect immediately.
const fetchUser = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).send({ msg: "Please log in first" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).send({ msg: "Account no longer exists" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({ msg: "Session expired. Please log in again" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.userType === "admin") return next();
  return res.status(403).send({ msg: "Admin access required" });
};

module.exports = { fetchUser, isAdmin };
