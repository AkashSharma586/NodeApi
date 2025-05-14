const express = require("express");
const Job = require("../models/Job");
const router = express.Router();

// Create job
router.post("/create", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// list the job 
router.post("/list", async (req, res) => {
  const { id, title, company, location } = req.body;
  let query = {};

  if (id) {
    query._id = id;
  } else {
    if (title) query.title = new RegExp(title, "i");
    if (company) query.company = new RegExp(company, "i");
    if (location) query.location = new RegExp(location, "i");
  }

  try {
    const jobs = await Job.find(query);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update job (POST instead of PUT)
router.post("/update", async (req, res) => {
  const { id, ...updateData } = req.body;
  try {
    const job = await Job.findByIdAndUpdate(id, updateData, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete job (POST instead of DELETE)
router.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Job.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
