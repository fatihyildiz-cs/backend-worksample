export enum StatusCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalError = 500
}

export class AppError extends Error {
  public readonly statusCode: StatusCode = null;
  public readonly context: any = null;
  public readonly isOperational: boolean = true;

  constructor(statusCode: StatusCode, message: string, context?: any, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.context = context;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, context?: any, isOperational = true) {
    super(StatusCode.BadRequest, message, context, isOperational);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, context?: any, isOperational = true) {
    super(StatusCode.Unauthorized, message, context, isOperational);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, context?: any, isOperational = true) {
    super(StatusCode.Forbidden, message, context, isOperational);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, context?: any, isOperational = true) {
    super(StatusCode.NotFound, message, context, isOperational);
  }
}

export class InternalError extends AppError {
  constructor(message: string, context?: any, isOperational = true) {
    super(StatusCode.InternalError, message, context, isOperational);
  }
}