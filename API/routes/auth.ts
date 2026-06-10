import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { verifyToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "sweet_delights_secret_key";

// POST /api/auth/signup
router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken." });
    }

    // Auto-grant admin role if username is "admin"
    const isAdmin = username.toLowerCase() === "admin";

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      isAdmin
    });

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, isAdmin: newUser.isAdmin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        isAdmin: newUser.isAdmin
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get("/me", verifyToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
