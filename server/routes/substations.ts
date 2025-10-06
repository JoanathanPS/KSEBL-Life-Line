import { Router } from 'express';
import { db } from '../db.js';
import { substations, feeders, lineBreakEvents } from '../../shared/schema.js';
import { eq, sql } from 'drizzle-orm';
import { authenticate } from '../middleware/auth.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const router = Router();

// Get all substations
router.get('/', authenticate, async (req, res, next) => {
  try {
    const substationsData = await db
      .select({
        id: substations.id,
        name: substations.name,
        code: substations.code,
        locationLat: substations.locationLat,
        locationLng: substations.locationLng,
        voltageLevel: substations.voltageLevel,
        capacityMva: substations.capacityMva,
        isActive: substations.isActive,
        activeEvents: sql<number>`count(${lineBreakEvents.id})`,
      })
      .from(substations)
      .leftJoin(feeders, eq(substations.id, feeders.substationId))
      .leftJoin(lineBreakEvents, eq(feeders.id, lineBreakEvents.feederId))
      .where(eq(lineBreakEvents.status, 'detected'))
      .groupBy(substations.id);

    res.json(ApiResponse.success({ substations: substationsData }));
  } catch (error) {
    next(error);
  }
});

// Get substation by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const [substation] = await db
      .select()
      .from(substations)
      .where(eq(substations.id, id))
      .limit(1);

    if (!substation) {
      throw ApiError.notFound('Substation not found');
    }

    res.json(ApiResponse.success({ substation }));
  } catch (error) {
    next(error);
  }
});

export default router;