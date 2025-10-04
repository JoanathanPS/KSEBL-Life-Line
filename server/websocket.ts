import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

interface WebSocketClient extends WebSocket {
  isAlive: boolean;
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ 
    server,
    path: "/ws",
  });

  // Heartbeat to detect broken connections
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const client = ws as WebSocketClient;
      if (client.isAlive === false) return client.terminate();
      client.isAlive = false;
      client.ping();
    });
  }, 30000);

  wss.on("close", () => {
    clearInterval(interval);
  });

  wss.on("connection", (ws: WebSocketClient) => {
    ws.isAlive = true;

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        if (data.type === "subscribe") {
          // Client subscribes to updates
          ws.send(JSON.stringify({ type: "subscribed", data: { channels: data.channels } }));
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    // Send initial connection confirmation
    ws.send(JSON.stringify({ type: "connected", data: { message: "Connected to KSEBL LIFE LINE" } }));
  });

  return wss;
}

// Broadcast event to all connected clients
export function broadcastEvent(wss: WebSocketServer, eventType: string, data: any) {
  const message = JSON.stringify({ type: eventType, data });
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
