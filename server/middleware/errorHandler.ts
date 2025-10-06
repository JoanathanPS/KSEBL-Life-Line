import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * Global error handling middleware
 * Follows .cursorrules standards for error handling
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_SERVER_ERROR';

  // Handle ApiError instances
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
  } else if (err.name === 'ValidationError') {
    // Handle Zod validation errors
    statusCode = 422;
    message = 'Validation failed';
    code = 'VALIDATION_ERROR';
  } else if (err.name === 'JsonWebTokenError') {
    // Handle JWT errors
    statusCode = 401;
    message = 'Invalid token';
    code = 'UNAUTHORIZED';
  } else if (err.name === 'TokenExpiredError') {
    // Handle expired JWT
    statusCode = 401;
    message = 'Token expired';
    code = 'UNAUTHORIZED';
  } else if (err.name === 'CastError') {
    // Handle database cast errors
    statusCode = 400;
    message = 'Invalid ID format';
    code = 'BAD_REQUEST';
  } else if (err.name === 'MongoError' || err.name === 'MongooseError') {
    // Handle database errors
    statusCode = 500;
    message = 'Database error';
    code = 'DATABASE_ERROR';
  }

  // Log error details
  console.error('Error occurred:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Send error response
  const errorResponse = ApiResponse.error(code, message, statusCode);
  
  // Add stack trace in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    errorResponse.error!.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse.toJSON());
};

/**
 * Handle 404 errors for undefined routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = ApiError.notFound(`Route ${req.originalUrl} not found`);
  res.status(404).json(error.toJSON());
};

/**
 * Handle async errors
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
