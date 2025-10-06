/**
 * Custom API Error class for handling application-specific errors
 * Follows the .cursorrules standards for error handling
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly timestamp: string;

  constructor(
    statusCode: number,
    message: string,
    code?: string,
    isOperational: boolean = true
  ) {
    super(message);
    
    this.statusCode = statusCode;
    this.code = code || this.getDefaultCode(statusCode);
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  private getDefaultCode(statusCode: number): string {
    const codeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
    };

    return codeMap[statusCode] || 'UNKNOWN_ERROR';
  }

  /**
   * Create a bad request error
   */
  static badRequest(message: string, code?: string): ApiError {
    return new ApiError(400, message, code);
  }

  /**
   * Create an unauthorized error
   */
  static unauthorized(message: string = 'Unauthorized'): ApiError {
    return new ApiError(401, message, 'UNAUTHORIZED');
  }

  /**
   * Create a forbidden error
   */
  static forbidden(message: string = 'Forbidden'): ApiError {
    return new ApiError(403, message, 'FORBIDDEN');
  }

  /**
   * Create a not found error
   */
  static notFound(message: string = 'Resource not found'): ApiError {
    return new ApiError(404, message, 'NOT_FOUND');
  }

  /**
   * Create a validation error
   */
  static validationError(message: string, details?: any): ApiError {
    const error = new ApiError(422, message, 'VALIDATION_ERROR');
    if (details) {
      (error as any).details = details;
    }
    return error;
  }

  /**
   * Create a conflict error
   */
  static conflict(message: string): ApiError {
    return new ApiError(409, message, 'CONFLICT');
  }

  /**
   * Create a too many requests error
   */
  static tooManyRequests(message: string = 'Too many requests'): ApiError {
    return new ApiError(429, message, 'TOO_MANY_REQUESTS');
  }

  /**
   * Create an internal server error
   */
  static internal(message: string = 'Internal server error'): ApiError {
    return new ApiError(500, message, 'INTERNAL_SERVER_ERROR');
  }

  /**
   * Convert error to JSON response format
   */
  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        statusCode: this.statusCode,
        timestamp: this.timestamp,
        ...(process.env.NODE_ENV === 'development' && {
          stack: this.stack,
        }),
      },
    };
  }
}
