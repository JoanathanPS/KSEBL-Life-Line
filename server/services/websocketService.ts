import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { JWTService } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * WebSocket Service for real-time updates
 * Follows .cursorrules standards for service layer
 */

export interface WebSocketClient {
  ws: WebSocket;
  userId: string;
  role: string;
  subscriptions: Set<string>;
  lastPing: number;
}

export interface WebSocketMessage {
  type: 'event' | 'alert' | 'status' | 'ping' | 'pong' | 'error';
  data: any;
  timestamp: string;
}

export interface EventUpdate {
  eventId: string;
  type: 'created' | 'updated' | 'resolved';
  data: any;
}

export interface AlertUpdate {
  alertId: string;
  type: 'sent' | 'failed';
  data: any;
}

export interface StatusUpdate {
  system: 'online' | 'offline' | 'maintenance';
  activeEvents: number;
  modelAccuracy: number;
  lastUpdate: string;
}

export class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, WebSocketClient> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private readonly heartbeatIntervalMs = 30000; // 30 seconds
  private readonly connectionTimeoutMs = 60000; // 60 seconds

  /**
   * Initialize WebSocket server
   */
  initialize(server: any): void {
    this.wss = new WebSocketServer({ 
      server,
      path: process.env.WEBSOCKET_PATH || '/ws',
    });

    this.wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      this.handleConnection(ws, request);
    });

    // Start heartbeat
    this.startHeartbeat();

    console.log('✅ WebSocket service initialized');
  }

  /**
   * Handle new WebSocket connection
   */
  private handleConnection(ws: WebSocket, request: IncomingMessage): void {
    const clientId = this.generateClientId();
    
    // Set up client
    const client: WebSocketClient = {
      ws,
      userId: '',
      role: '',
      subscriptions: new Set(),
      lastPing: Date.now(),
    };

    this.clients.set(clientId, client);

    // Handle authentication
    this.authenticateClient(client, request)
      .then(() => {
        this.sendMessage(client, {
          type: 'status',
          data: { message: 'Connected successfully' },
          timestamp: new Date().toISOString(),
        });
      })
      .catch((error) => {
        this.sendError(client, 'Authentication failed');
        this.disconnectClient(clientId);
      });

    // Handle messages
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(clientId, message);
      } catch (error) {
        this.sendError(client, 'Invalid message format');
      }
    });

    // Handle close
    ws.on('close', () => {
      this.disconnectClient(clientId);
    });

    // Handle ping/pong
    ws.on('pong', () => {
      if (this.clients.has(clientId)) {
        this.clients.get(clientId)!.lastPing = Date.now();
      }
    });

    // Set up ping interval
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      } else {
        clearInterval(pingInterval);
      }
    }, this.heartbeatIntervalMs);
  }

  /**
   * Authenticate WebSocket client
   */
  private async authenticateClient(client: WebSocketClient, request: IncomingMessage): Promise<void> {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      throw new ApiError.unauthorized('No authentication token provided');
    }

    try {
      const payload = JWTService.verifyAccessToken(token);
      client.userId = payload.userId;
      client.role = payload.role;
    } catch (error) {
      throw ApiError.unauthorized('Invalid authentication token');
    }
  }

  /**
   * Handle incoming WebSocket message
   */
  private handleMessage(clientId: string, message: WebSocketMessage): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'ping':
        this.sendMessage(client, {
          type: 'pong',
          data: { timestamp: Date.now() },
          timestamp: new Date().toISOString(),
        });
        break;

      case 'subscribe':
        this.handleSubscription(client, message.data);
        break;

      case 'unsubscribe':
        this.handleUnsubscription(client, message.data);
        break;

      default:
        this.sendError(client, 'Unknown message type');
    }
  }

  /**
   * Handle subscription request
   */
  private handleSubscription(client: WebSocketClient, data: { channel: string }): void {
    if (data.channel && typeof data.channel === 'string') {
      client.subscriptions.add(data.channel);
      this.sendMessage(client, {
        type: 'status',
        data: { message: `Subscribed to ${data.channel}` },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Handle unsubscription request
   */
  private handleUnsubscription(client: WebSocketClient, data: { channel: string }): void {
    if (data.channel && typeof data.channel === 'string') {
      client.subscriptions.delete(data.channel);
      this.sendMessage(client, {
        type: 'status',
        data: { message: `Unsubscribed from ${data.channel}` },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Broadcast event update to subscribed clients
   */
  broadcastEventUpdate(update: EventUpdate): void {
    const message: WebSocketMessage = {
      type: 'event',
      data: update,
      timestamp: new Date().toISOString(),
    };

    this.broadcastToSubscribers('events', message);
  }

  /**
   * Broadcast alert update to subscribed clients
   */
  broadcastAlertUpdate(update: AlertUpdate): void {
    const message: WebSocketMessage = {
      type: 'alert',
      data: update,
      timestamp: new Date().toISOString(),
    };

    this.broadcastToSubscribers('alerts', message);
  }

  /**
   * Broadcast status update to all clients
   */
  broadcastStatusUpdate(update: StatusUpdate): void {
    const message: WebSocketMessage = {
      type: 'status',
      data: update,
      timestamp: new Date().toISOString(),
    };

    this.broadcastToAll(message);
  }

  /**
   * Broadcast to clients subscribed to a specific channel
   */
  private broadcastToSubscribers(channel: string, message: WebSocketMessage): void {
    for (const [clientId, client] of this.clients) {
      if (client.subscriptions.has(channel) && client.ws.readyState === WebSocket.OPEN) {
        this.sendMessage(client, message);
      }
    }
  }

  /**
   * Broadcast to all connected clients
   */
  private broadcastToAll(message: WebSocketMessage): void {
    for (const [clientId, client] of this.clients) {
      if (client.ws.readyState === WebSocket.OPEN) {
        this.sendMessage(client, message);
      }
    }
  }

  /**
   * Send message to specific client
   */
  private sendMessage(client: WebSocketClient, message: WebSocketMessage): void {
    if (client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
      }
    }
  }

  /**
   * Send error message to client
   */
  private sendError(client: WebSocketClient, error: string): void {
    this.sendMessage(client, {
      type: 'error',
      data: { message: error },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Disconnect client
   */
  private disconnectClient(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.ws.close();
      this.clients.delete(clientId);
      console.log(`Client ${clientId} disconnected`);
    }
  }

  /**
   * Generate unique client ID
   */
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start heartbeat to check client connections
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();
      
      for (const [clientId, client] of this.clients) {
        if (now - client.lastPing > this.connectionTimeoutMs) {
          console.log(`Client ${clientId} timed out`);
          this.disconnectClient(clientId);
        }
      }
    }, this.heartbeatIntervalMs);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Get connection statistics
   */
  getStats(): {
    totalConnections: number;
    activeConnections: number;
    subscriptions: Record<string, number>;
  } {
    const subscriptions: Record<string, number> = {};
    let activeConnections = 0;

    for (const client of this.clients.values()) {
      if (client.ws.readyState === WebSocket.OPEN) {
        activeConnections++;
        
        for (const channel of client.subscriptions) {
          subscriptions[channel] = (subscriptions[channel] || 0) + 1;
        }
      }
    }

    return {
      totalConnections: this.clients.size,
      activeConnections,
      subscriptions,
    };
  }

  /**
   * Close all connections and cleanup
   */
  close(): void {
    this.stopHeartbeat();
    
    for (const [clientId, client] of this.clients) {
      client.ws.close();
    }
    
    this.clients.clear();
    
    if (this.wss) {
      this.wss.close();
    }
    
    console.log('WebSocket service closed');
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
