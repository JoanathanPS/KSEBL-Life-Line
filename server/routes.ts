import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupWebSocket } from "./websocket";
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import eventsRoutes from "./routes/events";
import feedersRoutes from "./routes/feeders";
import substationsRoutes from "./routes/substations";
import waveformsRoutes from "./routes/waveforms";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register all API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/events", eventsRoutes);
  app.use("/api/feeders", feedersRoutes);
  app.use("/api/substations", substationsRoutes);
  app.use("/api/waveforms", waveformsRoutes);

  const httpServer = createServer(app);
  
  // Setup WebSocket for real-time updates
  setupWebSocket(httpServer);

  return httpServer;
}
