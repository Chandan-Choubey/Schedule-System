import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  user: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  duration: { type: Number, required: true },
  scheduledSlots: [
    {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      attendees: [
        {
          name: { type: String, required: true },
          email: { type: String, required: true },
        },
      ],
    },
  ],
});

export const Session = mongoose.model("Session", sessionSchema);
