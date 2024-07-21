import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const baseFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.label({ label: 'hhplus-concert' }),
  winston.format.errors({ stack: true }),
);

const consoleFormat = winston.format.combine(
  winston.format.printf(
    ({ level, message, label, timestamp }) =>
      `${timestamp} [${label}] ${level}: ${message}`,
  ),
);

const fileFormat = winston.format.combine(
  winston.format.printf(
    ({ level, message, label, timestamp, stack }) =>
      `${timestamp} [${label}] ${level}: ${message}${stack ? `\n${stack}` : ''}`,
  ),
);

const httpTransport = new winston.transports.Console({
  level: 'http',
  format: consoleFormat,
});

const errorTransport = new winston.transports.File({
  filename: 'logs/errors.log',
  level: 'error',
  format: fileFormat,
});

const infoTransport = new winston.transports.File({
  filename: 'logs/info.log',
  level: 'info',
  format: fileFormat,
});

const warnTransport = new winston.transports.File({
  filename: 'logs/warn.log',
  level: 'warn',
  format: fileFormat,
});

const debugTransport = new winston.transports.File({
  filename: 'logs/debug.log',
  level: 'debug',
  format: fileFormat,
});

@Module({
  imports: [
    WinstonModule.forRoot({
      format: baseFormat,
      transports: [
        httpTransport,
        errorTransport,
        infoTransport,
        warnTransport,
        debugTransport,
      ],
    }),
  ],
})
export class LoggingModule {}
