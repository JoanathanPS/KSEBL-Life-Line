import { Router } from "express";
import { storage } from "../storage";
import { requireAuth } from "../auth";

const router = Router();

// Get dashboard statistics
router.get("/stats", requireAuth, async (req, res) => {
  try {
    // Get all events and feeders for stats
    const [events, feeders, substations] = await Promise.all([
      storage.getAllLineBreakEvents(),
      storage.getAllFeeders(),
      storage.getAllSubstations(),
    ]);

    const activeEvents = events.filter((e) => e.status !== "resolved").length;
    const healthyFeeders = feeders.filter((f) => f.isActive).length;
    const criticalEvents = events.filter(
      (e) => e.severity === "critical" && e.status !== "resolved"
    ).length;

    // Calculate average response time (mock for now)
    const avgResponseTime = "12 min";

    res.json({
      activeEvents,
      healthyFeeders,
      totalFeeders: feeders.length,
      activeAlerts: criticalEvents,
      avgResponseTime,
      totalSubstations: substations.length,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

// Get recent events for dashboard
router.get("/recent-events", requireAuth, async (req, res) => {
  try {
    const events = await storage.getAllLineBreakEvents();
    const recentEvents = events.slice(0, 10);

    res.json({ events: recentEvents });
  } catch (error) {
    console.error("Error fetching recent events:", error);
    res.status(500).json({ error: "Failed to fetch recent events" });
  }
});

export default router;
