import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

/** The standard error body used by every endpoint (Lab 05 format). */
export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors: string[];
  timestamp: string;
  path: string;
}

/** Short summary per status code; the details go in `errors`. */
const SUMMARIES: Record<number, string> = {
  400: 'Bad request.',
  401: 'Authentication required.',
  403: 'Access denied.',
  404: 'Resource not found.',
  409: 'Conflict with existing data.',
  500: 'Internal server error.',
};

/** MySQL / MariaDB error numbers that come from our own constraints. */
const MYSQL_ERRORS = {
  DUPLICATE_ENTRY: 1062, // UNIQUE violated
  ROW_IS_REFERENCED: 1451, // delete blocked by a foreign key
  NO_REFERENCED_ROW: 1452, // foreign key points to a missing row
  CHECK_VIOLATED_MYSQL: 3819,
  CHECK_VIOLATED_MARIADB: 4025,
};

/**
 * Catches every error thrown anywhere in the app and turns it into the same
 * JSON shape, so clients always know what an error looks like.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { statusCode, message, errors } = this.describe(exception);

    if (statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.originalUrl}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ErrorResponse = {
      success: false,
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    };
    response.status(statusCode).json(body);
  }

  private describe(exception: unknown): {
    statusCode: number;
    message: string;
    errors: string[];
  } {
    // 1. Errors we throw on purpose (NotFoundException, ConflictException, ...)
    //    and validation errors from the ValidationPipe
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const res = exception.getResponse();
      const detail =
        typeof res === 'string'
          ? res
          : (res as { message?: string | string[] }).message;

      if (Array.isArray(detail)) {
        return { statusCode, message: 'Validation failed.', errors: detail };
      }
      return {
        statusCode,
        message: SUMMARIES[statusCode] ?? exception.name,
        errors: [detail ?? exception.message],
      };
    }

    // 2. Database errors that slipped past the service checks
    if (exception instanceof QueryFailedError) {
      const errno = (exception.driverError as { errno?: number })?.errno;
      switch (errno) {
        case MYSQL_ERRORS.DUPLICATE_ENTRY:
          return {
            statusCode: HttpStatus.CONFLICT,
            message: SUMMARIES[409],
            errors: ['A record with the same unique value already exists.'],
          };
        case MYSQL_ERRORS.ROW_IS_REFERENCED:
          return {
            statusCode: HttpStatus.CONFLICT,
            message: SUMMARIES[409],
            errors: [
              'This record is still used by other records (e.g. logs or maintenance requests) and cannot be deleted.',
            ],
          };
        case MYSQL_ERRORS.NO_REFERENCED_ROW:
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: SUMMARIES[400],
            errors: ['A referenced record does not exist.'],
          };
        case MYSQL_ERRORS.CHECK_VIOLATED_MYSQL:
        case MYSQL_ERRORS.CHECK_VIOLATED_MARIADB:
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: SUMMARIES[400],
            errors: ['A value is outside the allowed range.'],
          };
      }
    }

    // 3. Anything else is a bug: hide the details from the client
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: SUMMARIES[500],
      errors: ['An unexpected error occurred. Please try again later.'],
    };
  }
}
