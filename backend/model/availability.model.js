import mongoose from "mongoose";
const AvailabilitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  duration: { type: Number, default: 30 },
  scheduledSlots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
});

export const Availability =
  mongoose.model.Availability ||
  mongoose.model("Availability", AvailabilitySchema);
