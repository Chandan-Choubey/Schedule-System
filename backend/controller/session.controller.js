import express from "express";
import { Session } from "../model/session.model.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import mongoose from "mongoose";

const router = express.Router();

// Create session
router.post("/", verifyToken, async (req, res) => {
  try {
    const { user, start, end, duration, scheduledSlots } = req.body;

    // Validate input
    if (
      !user ||
      !start ||
      !end ||
      !duration ||
      !Array.isArray(scheduledSlots)
    ) {
      return res.status(400).json({ msg: "Invalid input" });
    }

    // Create and save session
    const session = new Session({
      user,
      start: new Date(start),
      end: new Date(end),
      duration: Number(duration),
      scheduledSlots,
    });

    const response = await session.save();

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Server error", err });
  }
});

// Fetch user availability
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const sessions = await Session.find({ user: userId });

    if (!sessions) {
      return res.status(404).json({ msg: "No sessions found" });
    }

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Server error", err });
  }
});

// Update session
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end, duration, scheduledSlots } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }

    const session = await Session.findByIdAndUpdate(
      id,
      {
        start: new Date(start),
        end: new Date(end),
        duration: Number(duration),
        scheduledSlots,
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ msg: "Session not found" });
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: "Server error", err });
  }
});

// Delete session
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }
    const session = await Session.findByIdAndDelete(id);

    if (!session) {
      return res.status(404).json({ msg: "Session not found" });
    }

    res.json({ msg: "Session deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error", err: err.message });
  }
});

export default router;
