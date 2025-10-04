import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, text, boolean, timestamp, decimal, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const substations = pgTable("substations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  locationLat: decimal("location_lat", { precision: 10, scale: 8 }),
  locationLng: decimal("location_lng", { precision: 11, scale: 8 }),
  address: text("address"),
  voltageLevel: varchar("voltage_level", { length: 50 }),
  capacityMva: decimal("capacity_mva", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const feeders = pgTable("feeders", {
  id: uuid("id").primaryKey().defaultRandom(),
  substationId: uuid("substation_id").references(() => substations.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  lengthKm: decimal("length_km", { precision: 10, scale: 2 }),
  conductorType: varchar("conductor_type", { length: 100 }),
  lineImpedanceReal: decimal("line_impedance_real", { precision: 10, scale: 4 }),
  lineImpedanceImag: decimal("line_impedance_imag", { precision: 10, scale: 4 }),
  typicalLoadKw: decimal("typical_load_kw", { precision: 10, scale: 2 }),
  numConsumers: integer("num_consumers"),
  areaType: varchar("area_type", { length: 50 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const lineBreakEvents = pgTable("line_break_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  feederId: uuid("feeder_id").references(() => feeders.id, { onDelete: "cascade" }),
  detectedAt: timestamp("detected_at", { withTimezone: true }).notNull(),
  detectionMethod: varchar("detection_method", { length: 50 }).default("ai_model"),
  confidenceScore: decimal("confidence_score", { precision: 5, scale: 4 }),
  estimatedLocationKm: decimal("estimated_location_km", { precision: 10, scale: 3 }),
  faultType: varchar("fault_type", { length: 50 }).default("LINE_BREAK"),
  severity: varchar("severity", { length: 50 }),
  status: varchar("status", { length: 50 }).default("detected"),
  breakerTripped: boolean("breaker_tripped").default(false),
  tripTimeMs: integer("trip_time_ms"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  resolutionNotes: text("resolution_notes"),
  assignedTo: uuid("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const waveformData = pgTable("waveform_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  feederId: uuid("feeder_id").references(() => feeders.id, { onDelete: "cascade" }),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
  currentR: text("current_r").array(),
  currentY: text("current_y").array(),
  currentB: text("current_b").array(),
  voltageR: text("voltage_r").array(),
  voltageY: text("voltage_y").array(),
  voltageB: text("voltage_b").array(),
  samplingRate: integer("sampling_rate").default(10000),
  durationSeconds: decimal("duration_seconds", { precision: 5, scale: 2 }),
  label: varchar("label", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const featureData = pgTable("feature_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  waveformId: uuid("waveform_id").references(() => waveformData.id, { onDelete: "cascade" }),
  features: jsonb("features").notNull(),
  label: varchar("label", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => lineBreakEvents.id, { onDelete: "cascade" }),
  alertType: varchar("alert_type", { length: 50 }),
  recipientId: uuid("recipient_id").references(() => users.id),
  recipientContact: varchar("recipient_contact", { length: 255 }),
  message: text("message"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  status: varchar("status", { length: 50 }).default("pending"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const systemLogs = pgTable("system_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  level: varchar("level", { length: 20 }),
  module: varchar("module", { length: 100 }),
  message: text("message"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const modelMetrics = pgTable("model_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelVersion: varchar("model_version", { length: 50 }),
  accuracy: decimal("accuracy", { precision: 5, scale: 4 }),
  precision: decimal("precision", { precision: 5, scale: 4 }),
  recall: decimal("recall", { precision: 5, scale: 4 }),
  f1Score: decimal("f1_score", { precision: 5, scale: 4 }),
  falsePositiveRate: decimal("false_positive_rate", { precision: 5, scale: 4 }),
  evaluationDate: timestamp("evaluation_date", { withTimezone: true }).defaultNow(),
  datasetSize: integer("dataset_size"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubstationSchema = createInsertSchema(substations).omit({
  id: true,
  createdAt: true,
});

export const insertFeederSchema = createInsertSchema(feeders).omit({
  id: true,
  createdAt: true,
});

export const insertLineBreakEventSchema = createInsertSchema(lineBreakEvents).omit({
  id: true,
  createdAt: true,
});

export const insertWaveformDataSchema = createInsertSchema(waveformData).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({
  id: true,
  createdAt: true,
});

export const insertModelMetricsSchema = createInsertSchema(modelMetrics).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Substation = typeof substations.$inferSelect;
export type InsertSubstation = z.infer<typeof insertSubstationSchema>;

export type Feeder = typeof feeders.$inferSelect;
export type InsertFeeder = z.infer<typeof insertFeederSchema>;

export type LineBreakEvent = typeof lineBreakEvents.$inferSelect;
export type InsertLineBreakEvent = z.infer<typeof insertLineBreakEventSchema>;

export type WaveformData = typeof waveformData.$inferSelect;
export type InsertWaveformData = z.infer<typeof insertWaveformDataSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type SystemLog = typeof systemLogs.$inferSelect;
export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;

export type ModelMetrics = typeof modelMetrics.$inferSelect;
export type InsertModelMetrics = z.infer<typeof insertModelMetricsSchema>;
