/**
 * Standardized API Response class for consistent API responses
 * Follows the .cursorrules standards for API design
 */
export class ApiResponse<T = any> {
  public readonly success: boolean;
  public readonly data?: T;
  public readonly message?: string;
  public readonly error?: {
    code: string;
    message: string;
    statusCode: number;
    timestamp: string;
    stack?: string;
  };
  public readonly meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };

  constructor(
    success: boolean,
    data?: T,
    message?: string,
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    }
  ) {
    this.success = success;
    if (data !== undefined) this.data = data;
    if (message) this.message = message;
    if (meta) this.meta = meta;
  }

  /**
   * Create a successful response
   */
  static success<T>(
    data?: T,
    message?: string,
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    }
  ): ApiResponse<T> {
    return new ApiResponse(true, data, message, meta);
  }

  /**
   * Create a created response (201)
   */
  static created<T>(
    data?: T,
    message: string = 'Resource created successfully'
  ): ApiResponse<T> {
    return new ApiResponse(true, data, message);
  }

  /**
   * Create an updated response
   */
  static updated<T>(
    data?: T,
    message: string = 'Resource updated successfully'
  ): ApiResponse<T> {
    return new ApiResponse(true, data, message);
  }

  /**
   * Create a deleted response
   */
  static deleted(message: string = 'Resource deleted successfully'): ApiResponse {
    return new ApiResponse(true, undefined, message);
  }

  /**
   * Create a paginated response
   */
  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): ApiResponse<T[]> {
    const totalPages = Math.ceil(total / limit);
    return new ApiResponse(
      true,
      data,
      message,
      {
        page,
        limit,
        total,
        totalPages,
      }
    );
  }

  /**
   * Create an error response
   */
  static error(
    code: string,
    message: string,
    statusCode: number = 500,
    stack?: string
  ): ApiResponse {
    const response = new ApiResponse(false);
    response.error = {
      code,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      ...(stack && { stack }),
    };
    return response;
  }

  /**
   * Convert to JSON format
   */
  toJSON() {
    const response: any = {
      success: this.success,
    };

    if (this.data !== undefined) {
      response.data = this.data;
    }

    if (this.message) {
      response.message = this.message;
    }

    if (this.error) {
      response.error = this.error;
    }

    if (this.meta) {
      response.meta = this.meta;
    }

    return response;
  }
}
