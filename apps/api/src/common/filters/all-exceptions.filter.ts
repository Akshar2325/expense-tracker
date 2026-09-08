import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { randomUUID } from "crypto";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private errorCounter = 0;

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId =
      (request.headers["x-request-id"] as string) || randomUUID();

    let status: number;
    let message: string;
    let code: string;
    let details: Record<string, unknown> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exResponse = exception.getResponse();

      if (typeof exResponse === "object" && exResponse !== null) {
        const ex = exResponse as Record<string, unknown>;
        message = (ex.message as string) || exception.message;
        code = (ex.code as string) || this.getErrorCode(status);
        details = ex.details as Record<string, unknown>;
      } else {
        message = exResponse as string;
        code = this.getErrorCode(status);
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
      code = "INTERNAL_ERROR";
      this.logger.error(`[${requestId}] ${exception.stack}`, exception);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = "An unexpected error occurred";
      code = "INTERNAL_ERROR";
    }

    if (status >= 500) {
      this.errorCounter++;
      this.logger.error(
        `[${requestId}] ${request.method} ${request.url} - ${status} ${code}`,
      );
    }

    response.status(status).json({
      error: {
        code,
        message,
        ...(details ? { details } : {}),
        requestId,
      },
    });
  }

  private getErrorCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return "VALIDATION_FAILED";
      case HttpStatus.UNAUTHORIZED:
        return "AUTH_INVALID_CREDENTIALS";
      case HttpStatus.FORBIDDEN:
        return "AUTH_SESSION_EXPIRED";
      case HttpStatus.NOT_FOUND:
        return "RESOURCE_NOT_FOUND";
      case HttpStatus.CONFLICT:
        return "TRANSACTION_CONFLICT";
      case HttpStatus.TOO_MANY_REQUESTS:
        return "RATE_LIMITED";
      default:
        return "INTERNAL_ERROR";
    }
  }
}
