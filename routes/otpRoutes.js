// const express = require("express");
// // const Otp = require("../models/Otp"); // should be separate model file

// const Otp = require("../models/Otp");
// const router = express.Router();

// // Generate OTP
// const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// // Send OTP
// router.post("/send", async (req, res) => {
//   const { phone } = req.body;
//   const otp = generateOTP();

//   await Otp.create({ phone, otp });
//   console.log(`OTP for ${phone} is ${otp}`);

//   res.json({ message: "OTP sent", otp });
// });

// // Verify OTP
// router.post("/verify", async (req, res) => {
//   const { phone, otp } = req.body;
//   const record = await Otp.findOne({ phone, otp });

//   if (!record) return res.status(400).json({ message: "Invalid OTP" });

//   await Otp.deleteMany({ phone });
//   res.json({ message: "OTP verified" });
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Otp = require("../models/Otp");

// Generate OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// Send OTP
router.post("/send", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const otp = generateOTP();

    // Store OTP in the database
    await Otp.create({ phone, otp });

    // Send response with OTP
    res.json({ message: "OTP sent successfully", otp });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP
router.post("/verify", async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required" });
  }

  try {
    const record = await Otp.findOne({ phone, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP verified, delete all OTP records for the phone
    await Otp.deleteMany({ phone });
    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
});

module.exports = router;
