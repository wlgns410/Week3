export enum ErrorCode {
  InvalidInput = 'INVALID_INPUT',
  NotFound = 'NOT_FOUND',
  Unauthorized = 'UNAUTHORIZED',
  Duplicated = 'DUPLICATED',
  Forbidden = 'FORBIDDEN',
  LimitExceeded = 'LIMIT_EXCEEDED',
  ServerError = 'SERVER_ERROR',
}

export class ExceptionError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'ExceptionError';
  }

  static of(errorCode: ErrorCode, message: string) {
    return new ExceptionError(errorCode, message);
  }

  static invalidInput(message: string) {
    return new ExceptionError(ErrorCode.InvalidInput, message);
  }

  static notFound(message: string) {
    return new ExceptionError(ErrorCode.NotFound, message);
  }

  static duplicated(message: string) {
    return new ExceptionError(ErrorCode.Duplicated, message);
  }

  static unauthorized(message: string) {
    return new ExceptionError(ErrorCode.Unauthorized, message);
  }

  static forbidden(message: string) {
    return new ExceptionError(ErrorCode.Forbidden, message);
  }

  static limitExceeded(message: string) {
    return new ExceptionError(ErrorCode.LimitExceeded, message);
  }

  static serverError(message: string) {
    return new ExceptionError(ErrorCode.ServerError, message);
  }
}
