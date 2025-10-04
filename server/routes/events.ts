import { Router } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { requireAuth, requireRole } from "../auth";
import { insertLineBreakEventSchema } from "@shared/schema";

const router = Router();

// Get all events with optional filters
router.get("/", requireAuth, async (req, res) => {
  try {
    const { status, severity, feederId } = req.query;

    const filters: any = {};
    if (status) filters.status = status as string;
    if (severity) filters.severity = severity as string;
    if (feederId) filters.feederId = feederId as string;

    const events = await storage.getAllLineBreakEvents(filters);
    res.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Get single event
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const event = await storage.getLineBreakEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// Create new event
router.post("/", requireRole("admin", "operator"), async (req, res) => {
  try {
    const data = insertLineBreakEventSchema.parse(req.body);
    const event = await storage.createLineBreakEvent(data);
    res.status(201).json({ event });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// Update event status
router.patch("/:id", requireRole("admin", "operator"), async (req, res) => {
  try {
    const updateSchema = z.object({
      status: z.enum(["detected", "acknowledged", "crew_dispatched", "resolved"]).optional(),
      assignedTo: z.string().uuid().optional(),
      resolutionNotes: z.string().optional(),
      resolvedAt: z.string().datetime().optional(),
    });

    const parsed = updateSchema.parse(req.body);
    const data: any = { ...parsed };
    if (data.resolvedAt) {
      data.resolvedAt = new Date(data.resolvedAt);
    }

    const event = await storage.updateLineBreakEvent(req.params.id, data);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ event });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

export default router;
