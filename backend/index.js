import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieparser from "cookie-parser";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieparser());
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

import userRouter from "./controller/user.controller.js";
import availabilityRouter from "./controller/availability.controller.js";
import sessionRouter from "./controller/session.controller.js";
// Define routes
app.use("/api/auth", userRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/sessions", sessionRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
