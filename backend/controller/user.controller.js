import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/users", verifyToken, async (req, res) => {
  try {
    // Ensure the requesting user is an admin
    console.log(req.user);
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Forbidden" });
    }
    // Fetch all users
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error", err });
  }
});
// Register User
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ email, password: await bcrypt.hash(password, 10) });
    await user.save();
    res.json({ msg: "User registered successfully", user });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    res.status(200).cookie("token", token, options).json({ token, user });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

export default router;
