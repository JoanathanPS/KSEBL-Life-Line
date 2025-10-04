import { Router } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { requireAuth } from "../auth";
import { insertWaveformDataSchema } from "@shared/schema";

const router = Router();

// Get waveforms by feeder
router.get("/", requireAuth, async (req, res) => {
  try {
    const { feederId } = req.query;

    if (!feederId) {
      return res.status(400).json({ error: "feederId query parameter is required" });
    }

    const waveforms = await storage.getWaveformsByFeeder(feederId as string);
    res.json({ waveforms });
  } catch (error) {
    console.error("Error fetching waveforms:", error);
    res.status(500).json({ error: "Failed to fetch waveforms" });
  }
});

// Get single waveform
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const waveform = await storage.getWaveformData(req.params.id);
    if (!waveform) {
      return res.status(404).json({ error: "Waveform not found" });
    }
    res.json({ waveform });
  } catch (error) {
    console.error("Error fetching waveform:", error);
    res.status(500).json({ error: "Failed to fetch waveform" });
  }
});

// Create new waveform data
router.post("/", requireAuth, async (req, res) => {
  try {
    const data = insertWaveformDataSchema.parse(req.body);
    const waveform = await storage.createWaveformData(data);
    res.status(201).json({ waveform });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Error creating waveform:", error);
    res.status(500).json({ error: "Failed to create waveform" });
  }
});

export default router;
