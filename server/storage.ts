import { eq, desc, and, or, like } from "drizzle-orm";
import { db } from "./db";
import {
  type User,
  type InsertUser,
  type Substation,
  type InsertSubstation,
  type Feeder,
  type InsertFeeder,
  type LineBreakEvent,
  type InsertLineBreakEvent,
  type WaveformData,
  type InsertWaveformData,
  type Alert,
  type InsertAlert,
  type SystemLog,
  type InsertSystemLog,
  type ModelMetrics,
  type InsertModelMetrics,
  users,
  substations,
  feeders,
  lineBreakEvents,
  waveformData,
  alerts,
  systemLogs,
  modelMetrics,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Substations
  getSubstation(id: string): Promise<Substation | undefined>;
  getSubstationByCode(code: string): Promise<Substation | undefined>;
  getAllSubstations(): Promise<Substation[]>;
  createSubstation(substation: InsertSubstation): Promise<Substation>;
  updateSubstation(id: string, data: Partial<InsertSubstation>): Promise<Substation | undefined>;

  // Feeders
  getFeeder(id: string): Promise<Feeder | undefined>;
  getFeederByCode(code: string): Promise<Feeder | undefined>;
  getFeedersBySubstation(substationId: string): Promise<Feeder[]>;
  getAllFeeders(): Promise<Feeder[]>;
  createFeeder(feeder: InsertFeeder): Promise<Feeder>;
  updateFeeder(id: string, data: Partial<InsertFeeder>): Promise<Feeder | undefined>;

  // Line Break Events
  getLineBreakEvent(id: string): Promise<LineBreakEvent | undefined>;
  getAllLineBreakEvents(filters?: {
    status?: string;
    severity?: string;
    feederId?: string;
  }): Promise<LineBreakEvent[]>;
  createLineBreakEvent(event: InsertLineBreakEvent): Promise<LineBreakEvent>;
  updateLineBreakEvent(id: string, data: Partial<InsertLineBreakEvent>): Promise<LineBreakEvent | undefined>;

  // Waveforms
  getWaveformData(id: string): Promise<WaveformData | undefined>;
  getWaveformsByFeeder(feederId: string): Promise<WaveformData[]>;
  createWaveformData(waveform: InsertWaveformData): Promise<WaveformData>;

  // Alerts
  getAlert(id: string): Promise<Alert | undefined>;
  getAlertsByEvent(eventId: string): Promise<Alert[]>;
  getAlertsByRecipient(recipientId: string): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: string, data: Partial<InsertAlert>): Promise<Alert | undefined>;

  // System Logs
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;
  getSystemLogs(limit?: number): Promise<SystemLog[]>;

  // Model Metrics
  createModelMetrics(metrics: InsertModelMetrics): Promise<ModelMetrics>;
  getLatestModelMetrics(): Promise<ModelMetrics | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Substations
  async getSubstation(id: string): Promise<Substation | undefined> {
    const result = await db.select().from(substations).where(eq(substations.id, id));
    return result[0];
  }

  async getSubstationByCode(code: string): Promise<Substation | undefined> {
    const result = await db.select().from(substations).where(eq(substations.code, code));
    return result[0];
  }

  async getAllSubstations(): Promise<Substation[]> {
    return await db.select().from(substations).where(eq(substations.isActive, true));
  }

  async createSubstation(substation: InsertSubstation): Promise<Substation> {
    const result = await db.insert(substations).values(substation).returning();
    return result[0];
  }

  async updateSubstation(id: string, data: Partial<InsertSubstation>): Promise<Substation | undefined> {
    const result = await db.update(substations).set(data).where(eq(substations.id, id)).returning();
    return result[0];
  }

  // Feeders
  async getFeeder(id: string): Promise<Feeder | undefined> {
    const result = await db.select().from(feeders).where(eq(feeders.id, id));
    return result[0];
  }

  async getFeederByCode(code: string): Promise<Feeder | undefined> {
    const result = await db.select().from(feeders).where(eq(feeders.code, code));
    return result[0];
  }

  async getFeedersBySubstation(substationId: string): Promise<Feeder[]> {
    return await db.select().from(feeders).where(eq(feeders.substationId, substationId));
  }

  async getAllFeeders(): Promise<Feeder[]> {
    return await db.select().from(feeders).where(eq(feeders.isActive, true));
  }

  async createFeeder(feeder: InsertFeeder): Promise<Feeder> {
    const result = await db.insert(feeders).values(feeder).returning();
    return result[0];
  }

  async updateFeeder(id: string, data: Partial<InsertFeeder>): Promise<Feeder | undefined> {
    const result = await db.update(feeders).set(data).where(eq(feeders.id, id)).returning();
    return result[0];
  }

  // Line Break Events
  async getLineBreakEvent(id: string): Promise<LineBreakEvent | undefined> {
    const result = await db.select().from(lineBreakEvents).where(eq(lineBreakEvents.id, id));
    return result[0];
  }

  async getAllLineBreakEvents(filters?: {
    status?: string;
    severity?: string;
    feederId?: string;
  }): Promise<LineBreakEvent[]> {
    if (!filters) {
      return await db.select().from(lineBreakEvents).orderBy(desc(lineBreakEvents.detectedAt));
    }

    const conditions = [];
    if (filters.status) conditions.push(eq(lineBreakEvents.status, filters.status));
    if (filters.severity) conditions.push(eq(lineBreakEvents.severity, filters.severity));
    if (filters.feederId) conditions.push(eq(lineBreakEvents.feederId, filters.feederId));

    if (conditions.length === 0) {
      return await db.select().from(lineBreakEvents).orderBy(desc(lineBreakEvents.detectedAt));
    }

    return await db
      .select()
      .from(lineBreakEvents)
      .where(and(...conditions))
      .orderBy(desc(lineBreakEvents.detectedAt));
  }

  async createLineBreakEvent(event: InsertLineBreakEvent): Promise<LineBreakEvent> {
    const result = await db.insert(lineBreakEvents).values(event).returning();
    return result[0];
  }

  async updateLineBreakEvent(id: string, data: Partial<InsertLineBreakEvent>): Promise<LineBreakEvent | undefined> {
    const result = await db.update(lineBreakEvents).set(data).where(eq(lineBreakEvents.id, id)).returning();
    return result[0];
  }

  // Waveforms
  async getWaveformData(id: string): Promise<WaveformData | undefined> {
    const result = await db.select().from(waveformData).where(eq(waveformData.id, id));
    return result[0];
  }

  async getWaveformsByFeeder(feederId: string): Promise<WaveformData[]> {
    return await db
      .select()
      .from(waveformData)
      .where(eq(waveformData.feederId, feederId))
      .orderBy(desc(waveformData.timestamp));
  }

  async createWaveformData(waveform: InsertWaveformData): Promise<WaveformData> {
    const result = await db.insert(waveformData).values(waveform).returning();
    return result[0];
  }

  // Alerts
  async getAlert(id: string): Promise<Alert | undefined> {
    const result = await db.select().from(alerts).where(eq(alerts.id, id));
    return result[0];
  }

  async getAlertsByEvent(eventId: string): Promise<Alert[]> {
    return await db.select().from(alerts).where(eq(alerts.eventId, eventId));
  }

  async getAlertsByRecipient(recipientId: string): Promise<Alert[]> {
    return await db.select().from(alerts).where(eq(alerts.recipientId, recipientId));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const result = await db.insert(alerts).values(alert).returning();
    return result[0];
  }

  async updateAlert(id: string, data: Partial<InsertAlert>): Promise<Alert | undefined> {
    const result = await db.update(alerts).set(data).where(eq(alerts.id, id)).returning();
    return result[0];
  }

  // System Logs
  async createSystemLog(log: InsertSystemLog): Promise<SystemLog> {
    const result = await db.insert(systemLogs).values(log).returning();
    return result[0];
  }

  async getSystemLogs(limit: number = 100): Promise<SystemLog[]> {
    return await db.select().from(systemLogs).orderBy(desc(systemLogs.createdAt)).limit(limit);
  }

  // Model Metrics
  async createModelMetrics(metrics: InsertModelMetrics): Promise<ModelMetrics> {
    const result = await db.insert(modelMetrics).values(metrics).returning();
    return result[0];
  }

  async getLatestModelMetrics(): Promise<ModelMetrics | undefined> {
    const result = await db.select().from(modelMetrics).orderBy(desc(modelMetrics.evaluationDate)).limit(1);
    return result[0];
  }
}

export const storage = new DatabaseStorage();
