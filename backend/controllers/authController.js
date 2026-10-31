const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?\d{10,13}$/;

const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  userType: u.userType,
});

// Compares two strings without leaking how many characters matched
const sameSecret = (a, b) => {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, userType, adminCode } = req.body;

    if (!name || !name.trim()) return res.status(400).send({ msg: "Name is required" });
    if (!EMAIL_RE.test(email || "")) return res.status(400).send({ msg: "Enter a valid email address" });
    if (!password || password.length < 6)
      return res.status(400).send({ msg: "Password must be at least 6 characters" });
    const cleanPhone = String(phone || "").replace(/[\s-]/g, "");
    if (!PHONE_RE.test(cleanPhone))
      return res.status(400).send({ msg: "Enter a valid phone number (10 digits)" });

    // Everyone is a customer unless they choose Admin AND give the correct access code.
    // The code lives only on the server (ADMIN_SIGNUP_CODE in .env). If it is not set,
    // admin signup is switched off, so nobody can make themselves an admin.
    let role = "customer";
    if (userType === "admin") {
      const secret = process.env.ADMIN_SIGNUP_CODE;
      if (!secret) return res.status(403).send({ msg: "Admin signup is disabled" });
      if (!adminCode || !sameSecret(adminCode, secret))
        return res.status(403).send({ msg: "Invalid admin access code" });
      role = "admin";
    } else if (userType && userType !== "customer") {
      return res.status(400).send({ msg: "Invalid user type" });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(409).send({ msg: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name: name.trim(),
      email,
      password: hashedPassword,
      phone: cleanPhone,
      userType: role,
    });

    res.status(201).send({ msg: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) return res.status(409).send({ msg: "Email already registered" });
    console.error("signup error:", error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send({ msg: "Email and password are required" });

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!ok) return res.status(401).send({ msg: "Invalid email or password" });

    // The role is signed into the token so the frontend can route by it.
    // The backend still re-checks the role from the database on every protected request.
    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.send({ token, user: publicUser(user) });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

exports.me = (req, res) => {
  res.send({ user: publicUser(req.user) });
};
