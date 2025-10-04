import { Router } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { requireAuth, requireRole } from "../auth";
import { insertFeederSchema } from "@shared/schema";

const router = Router();

// Get all feeders
router.get("/", requireAuth, async (req, res) => {
  try {
    const { substationId } = req.query;

    let feeders;
    if (substationId) {
      feeders = await storage.getFeedersBySubstation(substationId as string);
    } else {
      feeders = await storage.getAllFeeders();
    }

    res.json({ feeders });
  } catch (error) {
    console.error("Error fetching feeders:", error);
    res.status(500).json({ error: "Failed to fetch feeders" });
  }
});

// Get single feeder
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const feeder = await storage.getFeeder(req.params.id);
    if (!feeder) {
      return res.status(404).json({ error: "Feeder not found" });
    }
    res.json({ feeder });
  } catch (error) {
    console.error("Error fetching feeder:", error);
    res.status(500).json({ error: "Failed to fetch feeder" });
  }
});

// Create new feeder
router.post("/", requireRole("admin"), async (req, res) => {
  try {
    const data = insertFeederSchema.parse(req.body);
    const feeder = await storage.createFeeder(data);
    res.status(201).json({ feeder });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Error creating feeder:", error);
    res.status(500).json({ error: "Failed to create feeder" });
  }
});

// Update feeder
router.patch("/:id", requireRole("admin"), async (req, res) => {
  try {
    const data = insertFeederSchema.partial().parse(req.body);
    const feeder = await storage.updateFeeder(req.params.id, data);

    if (!feeder) {
      return res.status(404).json({ error: "Feeder not found" });
    }

    res.json({ feeder });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Error updating feeder:", error);
    res.status(500).json({ error: "Failed to update feeder" });
  }
});

export default router;
