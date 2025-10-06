import { Router } from 'express';
import { db } from '../db.js';
import { lineBreakEvents, feeders, substations, users } from '../../shared/schema.js';
import { eq, desc, and, gte, lte } from 'drizzle-orm';
import { authenticate, operatorOrAdmin } from '../middleware/auth.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { mlService } from '../services/mlService.js';
import { alertService } from '../services/alertService.js';
import { websocketService } from '../services/websocketService.js';

const router = Router();

// Get all events with pagination and filtering
router.get('/', authenticate, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = (page - 1) * limit;
    const status = req.query.status as string;
    const severity = req.query.severity as string;

    let query = db
      .select({
        id: lineBreakEvents.id,
        detectedAt: lineBreakEvents.detectedAt,
        confidenceScore: lineBreakEvents.confidenceScore,
        estimatedLocationKm: lineBreakEvents.estimatedLocationKm,
        faultType: lineBreakEvents.faultType,
        severity: lineBreakEvents.severity,
        status: lineBreakEvents.status,
        breakerTripped: lineBreakEvents.breakerTripped,
        tripTimeMs: lineBreakEvents.tripTimeMs,
        resolvedAt: lineBreakEvents.resolvedAt,
        resolutionNotes: lineBreakEvents.resolutionNotes,
        assignedTo: lineBreakEvents.assignedTo,
        feederName: feeders.name,
        feederCode: feeders.code,
        substationName: substations.name,
        assignedUserName: users.fullName,
      })
      .from(lineBreakEvents)
      .leftJoin(feeders, eq(lineBreakEvents.feederId, feeders.id))
      .leftJoin(substations, eq(feeders.substationId, substations.id))
      .leftJoin(users, eq(lineBreakEvents.assignedTo, users.id))
      .orderBy(desc(lineBreakEvents.detectedAt))
      .limit(limit)
      .offset(offset);

    if (status) {
      query = query.where(eq(lineBreakEvents.status, status));
    }
    if (severity) {
      query = query.where(eq(lineBreakEvents.severity, severity));
    }

    const events = await query;
    const total = await db.select().from(lineBreakEvents);

    res.json(ApiResponse.paginated(
      events,
      page,
      limit,
      total.length,
      'Events retrieved successfully'
    ));
  } catch (error) {
    next(error);
  }
});

// Get event by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await db
      .select({
        id: lineBreakEvents.id,
        detectedAt: lineBreakEvents.detectedAt,
        confidenceScore: lineBreakEvents.confidenceScore,
        estimatedLocationKm: lineBreakEvents.estimatedLocationKm,
        faultType: lineBreakEvents.faultType,
        severity: lineBreakEvents.severity,
        status: lineBreakEvents.status,
        breakerTripped: lineBreakEvents.breakerTripped,
        tripTimeMs: lineBreakEvents.tripTimeMs,
        resolvedAt: lineBreakEvents.resolvedAt,
        resolutionNotes: lineBreakEvents.resolutionNotes,
        assignedTo: lineBreakEvents.assignedTo,
        feederName: feeders.name,
        feederCode: feeders.code,
        substationName: substations.name,
        assignedUserName: users.fullName,
      })
      .from(lineBreakEvents)
      .leftJoin(feeders, eq(lineBreakEvents.feederId, feeders.id))
      .leftJoin(substations, eq(feeders.substationId, substations.id))
      .leftJoin(users, eq(lineBreakEvents.assignedTo, users.id))
      .where(eq(lineBreakEvents.id, id))
      .limit(1);

    if (!event.length) {
      throw ApiError.notFound('Event not found');
    }

    res.json(ApiResponse.success({ event: event[0] }));
  } catch (error) {
    next(error);
  }
});

// Create new event (system generated)
router.post('/', authenticate, operatorOrAdmin, async (req, res, next) => {
  try {
    const { feederId, confidenceScore, estimatedLocationKm, severity } = req.body;

    const eventData = {
      feederId,
      detectedAt: new Date().toISOString(),
      detectionMethod: 'ai_model',
      confidenceScore: confidenceScore.toString(),
      estimatedLocationKm: estimatedLocationKm.toString(),
      faultType: 'LINE_BREAK',
      severity,
      status: 'detected',
      breakerTripped: true,
      tripTimeMs: Math.floor(Math.random() * 100) + 150,
    };

    const [event] = await db.insert(lineBreakEvents).values(eventData).returning();

    // Send alerts
    await alertService.sendEventAlerts({
      eventId: event.id,
      feederId: event.feederId,
      detectedAt: event.detectedAt,
      estimatedLocationKm: parseFloat(event.estimatedLocationKm),
      severity: event.severity,
      confidenceScore: parseFloat(event.confidenceScore),
      faultType: event.faultType,
    });

    // Broadcast real-time update
    websocketService.broadcastEventUpdate({
      eventId: event.id,
      type: 'created',
      data: event,
    });

    res.status(201).json(ApiResponse.created({ event }, 'Event created and alerts sent'));
  } catch (error) {
    next(error);
  }
});

// Acknowledge event
router.post('/:id/acknowledge', authenticate, operatorOrAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const [event] = await db
      .update(lineBreakEvents)
      .set({
        status: 'acknowledged',
        assignedTo: userId,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(lineBreakEvents.id, id))
      .returning();

    if (!event) {
      throw ApiError.notFound('Event not found');
    }

    // Broadcast real-time update
    websocketService.broadcastEventUpdate({
      eventId: event.id,
      type: 'updated',
      data: event,
    });

    res.json(ApiResponse.updated({ event }, 'Event acknowledged'));
  } catch (error) {
    next(error);
  }
});

// Resolve event
router.post('/:id/resolve', authenticate, operatorOrAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;

    const [event] = await db
      .update(lineBreakEvents)
      .set({
        status: 'resolved',
        resolvedAt: new Date().toISOString(),
        resolutionNotes,
      })
      .where(eq(lineBreakEvents.id, id))
      .returning();

    if (!event) {
      throw ApiError.notFound('Event not found');
    }

    // Broadcast real-time update
    websocketService.broadcastEventUpdate({
      eventId: event.id,
      type: 'resolved',
      data: event,
    });

    res.json(ApiResponse.updated({ event }, 'Event resolved'));
  } catch (error) {
    next(error);
  }
});

// Get active events
router.get('/active', authenticate, async (req, res, next) => {
  try {
    const events = await db
      .select({
        id: lineBreakEvents.id,
        detectedAt: lineBreakEvents.detectedAt,
        severity: lineBreakEvents.severity,
        status: lineBreakEvents.status,
        estimatedLocationKm: lineBreakEvents.estimatedLocationKm,
        feederName: feeders.name,
        feederCode: feeders.code,
        substationName: substations.name,
      })
      .from(lineBreakEvents)
      .leftJoin(feeders, eq(lineBreakEvents.feederId, feeders.id))
      .leftJoin(substations, eq(feeders.substationId, substations.id))
      .where(
        and(
          eq(lineBreakEvents.status, 'detected'),
          gte(lineBreakEvents.detectedAt, new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        )
      )
      .orderBy(desc(lineBreakEvents.detectedAt));

    res.json(ApiResponse.success({ events }));
  } catch (error) {
    next(error);
  }
});

export default router;