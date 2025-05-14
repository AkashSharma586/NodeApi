const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  const { phone } = req.body;

  let user = await User.findOne({ phone });
  if (!user) {
    user = new User({ phone });
    await user.save();
  }

  res.json({ message: 'User registered. Use this phone to login with OTP.' });
});

// LOGIN (Send OTP)
router.post('/login', async (req, res) => {
  const { phone } = req.body;
  const user = await User.findOne({ phone });

  if (!user) return res.status(400).json({ error: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  user.otp = otp;
  user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 mins
  await user.save();

  // Send OTP here via SMS/Email
  console.log(`OTP for ${phone}: ${otp}`); // For testing

  res.json({ message: 'OTP sent' });
});

// VERIFY OTP
router.post('/verify', async (req, res) => {
  const { phone, otp } = req.body;
  const user = await User.findOne({ phone });

  if (!user || user.otp !== otp || Date.now() > user.otpExpire) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  // Clear OTP
  user.otp = null;
  user.otpExpire = null;
  await user.save();

  // Generate JWT
  const token = jwt.sign({ id: user._id, phone: user.phone }, 'your_jwt_secret', {
    expiresIn: '1d',
  });

  res.json({ token });
});

module.exports = router;
