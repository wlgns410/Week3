import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ErrorExceptionFilter } from './logic-exception.filter';
import { LoggingInterceptor } from './logging.interceptor';
import { LoggingModule } from './logging.module';

@Module({
  imports: [LoggingModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class CommonModule {}
