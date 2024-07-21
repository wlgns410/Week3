import { ExceptionError, ErrorCode } from './exceptions';
import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch(ExceptionError)
export class ErrorExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(error: ExceptionError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();

    this.logger.error(`Error occurred: ${error.message}`, { error });

    switch (error.code) {
      case ErrorCode.InvalidInput:
        return response.status(400).json({
          code: 400,
          message: error.message,
        });
      case ErrorCode.NotFound:
        return response.status(404).json({
          code: 404,
          message: error.message,
        });
      case ErrorCode.Duplicated:
        return response.status(409).json({
          code: 409,
          message: error.message,
        });
      case ErrorCode.Unauthorized:
        return response.status(401).json({
          code: 401,
          message: error.message,
        });
      case ErrorCode.Forbidden:
        return response.status(403).json({
          code: 403,
          message: error.message,
        });
      case ErrorCode.LimitExceeded:
        return response.status(422).json({
          code: 422,
          message: error.message,
        });
      case ErrorCode.ServerError:
      default:
        return response.status(500).json({
          code: 500,
          message: 'Internal server error',
        });
    }
  }
}
