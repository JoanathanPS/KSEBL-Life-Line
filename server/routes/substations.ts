import { Router } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { requireAuth, requireRole } from "../auth";
import { insertSubstationSchema } from "@shared/schema";

const router = Router();

// Get all substations
router.get("/", requireAuth, async (req, res) => {
  try {
    const substations = await storage.getAllSubstations();
    res.json({ substations });
  } catch (error) {
    console.error("Error fetching substations:", error);
    res.status(500).json({ error: "Failed to fetch substations" });
  }
});

// Get single substation
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const substation = await storage.getSubstation(req.params.id);
    if (!substation) {
      return res.status(404).json({ error: "Substation not found" });
    }
    res.json({ substation });
  } catch (error) {
    console.error("Error fetching substation:", error);
    res.status(500).json({ error: "Failed to fetch substation" });
  }
});

// Create new substation
router.post("/", requireRole("admin"), async (req, res) => {
  try {
    const data = insertSubstationSchema.parse(req.body);
    const substation = await storage.createSubstation(data);
    res.status(201).json({ substation });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Error creating substation:", error);
    res.status(500).json({ error: "Failed to create substation" });
  }
});

// Update substation
router.patch("/:id", requireRole("admin"), async (req, res) => {
  try {
    const data = insertSubstationSchema.partial().parse(req.body);
    const substation = await storage.updateSubstation(req.params.id, data);

    if (!substation) {
      return res.status(404).json({ error: "Substation not found" });
    }

    res.json({ substation });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Error updating substation:", error);
    res.status(500).json({ error: "Failed to update substation" });
  }
});

export default router;
