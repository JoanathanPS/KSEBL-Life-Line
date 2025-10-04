import { Router } from "express";
import passport from "passport";
import { z } from "zod";
import { storage } from "../storage";
import { hashPassword, requireRole } from "../auth";
import { insertUserSchema } from "@shared/schema";

const router = Router();

// Login
router.post("/login", (req, res, next) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  try {
    loginSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({ error: "Authentication failed" });
    }
    if (!user) {
      return res.status(401).json({ error: info?.message || "Invalid credentials" });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Login failed" });
      }
      return res.json({ user });
    });
  })(req, res, next);
});

// Logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Get current user
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ user: req.user });
  }
  res.status(401).json({ error: "Not authenticated" });
});

// Register (only for admin)
router.post("/register", requireRole("admin"), async (req, res) => {
  try {
    const registerSchema = insertUserSchema.omit({ passwordHash: true }).extend({
      password: z.string().min(6),
    });

    const data = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(data.email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user
    const user = await storage.createUser({
      ...data,
      passwordHash,
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    res.status(500).json({ error: "Registration failed" });
  }
});

export default router;
