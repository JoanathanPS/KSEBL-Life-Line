import { Request, Response, NextFunction } from 'express';
import { JWTService, JWTPayload } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';
import { db } from '../db.js';
import { users } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';

/**
 * Extended Request interface with user information
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    fullName: string;
  };
}

/**
 * Authentication middleware to verify JWT tokens
 * Follows .cursorrules standards for middleware
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = JWTService.extractTokenFromHeader(authHeader);

    // Verify the access token
    const payload = JWTService.verifyAccessToken(token);

    // Check if user still exists and is active
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        fullName: users.fullName,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user.length || !user[0].isActive) {
      throw ApiError.unauthorized('User not found or inactive');
    }

    // Attach user information to request
    req.user = {
      id: user[0].id,
      email: user[0].email,
      role: user[0].role,
      fullName: user[0].fullName,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Authorization middleware to check user roles
 * @param roles - Array of allowed roles
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Insufficient permissions'));
    }

    next();
  };
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }

    const token = JWTService.extractTokenFromHeader(authHeader);
    const payload = JWTService.verifyAccessToken(token);

    // Check if user still exists and is active
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        fullName: users.fullName,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (user.length && user[0].isActive) {
      req.user = {
        id: user[0].id,
        email: user[0].email,
        role: user[0].role,
        fullName: user[0].fullName,
      };
    }

    next();
  } catch (error) {
    // For optional auth, we don't fail on token errors
    next();
  }
};

/**
 * Admin only middleware
 */
export const adminOnly = authorize('admin');

/**
 * Operator or Admin middleware
 */
export const operatorOrAdmin = authorize('admin', 'operator');

/**
 * Field crew or higher middleware
 */
export const fieldCrewOrHigher = authorize('admin', 'operator', 'field_crew');
