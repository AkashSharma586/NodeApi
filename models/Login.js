const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  otp: String,
  otpExpire: Date
});

module.exports = mongoose.model('User', userSchema);
