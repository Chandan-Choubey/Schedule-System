import express from "express";
import { Availability } from "../model/availability.model.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import mongoose from "mongoose";

const router = express.Router();

// Create availability
router.post("/", verifyToken, async (req, res) => {
  try {
    let { start, end, duration } = req.body;
    start = new Date(start);
    end = new Date(end);
    duration = Number(duration);

    const availability = new Availability({
      user: req.user.userId,
      start,
      end,
      duration,
    });

    const response = await availability.save();
    if (!response) {
      return res.status(400).json({ msg: "Failed to create availability" });
    }
    res.json(availability);
  } catch (err) {
    res.status(500).json({ error: "Server error", err });
  }
});

// Get user availability
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const availabilities = await Availability.find({ user: user.userId });
    res.json(availabilities);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end, duration } = req.body;
    console.log(start, end, duration);
    console.log(id);
    // Validate ID and convert to ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }

    const availability = await Availability.findByIdAndUpdate(
      id,
      {
        start: new Date(start),
        end: new Date(end),
        duration: Number(duration),
      },
      { new: true, runValidators: true }
    );

    if (!availability) {
      return res.status(404).json({ msg: "Availability not found" });
    }

    res.json(availability);
  } catch (err) {
    res.status(500).json({ error: "Server error", error: err.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }

    const availability = await Availability.findByIdAndDelete(id);

    if (!availability) {
      return res.status(404).json({ msg: "Availability not found" });
    }

    res.json({ msg: "Availability deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.get("/all", verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const availability = await Availability.find().populate("user", "email");
    res.json(availability);
  } catch (err) {
    res.status(500).json({ error: "Server error", err });
  }
});

router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const availability = await Availability.find({ user: userId });

    if (!availability || availability.length === 0) {
      return res
        .status(404)
        .json({ msg: "No availability found for this user" });
    }

    res.json(availability);
  } catch (err) {
    res.status(500).json({ error: "Server error", err });
  }
});

export default router;
