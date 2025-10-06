import { Router } from 'express';
import { db } from '../db.js';
import { feeders, substations, lineBreakEvents } from '../../shared/schema.js';
import { eq, sql } from 'drizzle-orm';
import { authenticate } from '../middleware/auth.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const router = Router();

// Get all feeders
router.get('/', authenticate, async (req, res, next) => {
  try {
    const feedersData = await db
      .select({
        id: feeders.id,
        name: feeders.name,
        code: feeders.code,
        substationId: feeders.substationId,
        substationName: substations.name,
        voltageLevel: feeders.voltageLevel,
        capacityMva: feeders.capacityMva,
        isActive: feeders.isActive,
        activeEvents: sql<number>`count(${lineBreakEvents.id})`,
      })
      .from(feeders)
      .leftJoin(substations, eq(feeders.substationId, substations.id))
      .leftJoin(lineBreakEvents, eq(feeders.id, lineBreakEvents.feederId))
      .where(eq(lineBreakEvents.status, 'detected'))
      .groupBy(feeders.id);

    res.json(ApiResponse.success({ feeders: feedersData }));
  } catch (error) {
    next(error);
  }
});

// Get feeder by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const [feeder] = await db
      .select({
        id: feeders.id,
        name: feeders.name,
        code: feeders.code,
        substationId: feeders.substationId,
        substationName: substations.name,
        voltageLevel: feeders.voltageLevel,
        capacityMva: feeders.capacityMva,
        isActive: feeders.isActive,
      })
      .from(feeders)
      .leftJoin(substations, eq(feeders.substationId, substations.id))
      .where(eq(feeders.id, id))
      .limit(1);

    if (!feeder) {
      throw ApiError.notFound('Feeder not found');
    }

    res.json(ApiResponse.success({ feeder }));
  } catch (error) {
    next(error);
  }
});

export default router;