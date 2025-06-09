
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Create user and return token
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "7d" });

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

module.exports = router;
