
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

// Connect to DB
mongoose.connect("mongodb://localhost:27017/mydatabase")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
const userRoutes = require("./routes/userRoutes");
const otpRoutes = require("./routes/otpRoutes");
const jobRoutes = require("./routes/jobRoutes");


app.use("/api/users", userRoutes);
app.use("/api/otp", otpRoutes);          // e.g., /api/otp/send
app.use("/api/jobs", jobRoutes);         // e.g., /api/jobs (POST, GET, etc.)

app.use('/api/auth', require('./routes/auth'));
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
