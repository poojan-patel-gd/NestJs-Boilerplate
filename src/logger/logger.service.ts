import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'silly',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          dirname: 'logs',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '45d',
        }),
      ],
    });
  };

  error(message: string, path?: string, trace?: string, obj?: object, arr?: any[]) {
    const formattedMessage = `--------->>  Message: ${message}\nPath: ${path || 'N/A'}\nTrace: ${trace || 'N/A'}\nObject: ${obj ? JSON.stringify(obj) : 'N/A'}\nArray: ${arr ? JSON.stringify(arr) : 'N/A'}`;
    this.logger.error(formattedMessage);
  }

  log(message: string, path?: string, trace?: string, obj?: object, arr?: any[]) {
    const formattedMessage = `--------->>  Message: ${message}\nPath: ${path || 'N/A'}\nTrace: ${trace || 'N/A'}\nObject: ${obj ? JSON.stringify(obj) : 'N/A'}\nArray: ${arr ? JSON.stringify(arr) : 'N/A'}`;
    this.logger.info(formattedMessage);
  }

  warn(message: string, path?: string, trace?: string, obj?: object, arr?: any[]) {
    const formattedMessage = `--------->>  Message: ${message}\nPath: ${path || 'N/A'}\nTrace: ${trace || 'N/A'}\nObject: ${obj ? JSON.stringify(obj) : 'N/A'}\nArray: ${arr ? JSON.stringify(arr) : 'N/A'}`;
    this.logger.warn(formattedMessage);
  }

  debug(message: string, path?: string, trace?: string, obj?: object, arr?: any[]) {
    const formattedMessage = `--------->>  Message: ${message}\nPath: ${path || 'N/A'}\nTrace: ${trace || 'N/A'}\nObject: ${obj ? JSON.stringify(obj) : 'N/A'}\nArray: ${arr ? JSON.stringify(arr) : 'N/A'}`;
    this.logger.debug(formattedMessage);
  }

  verbose(message: string, path?: string, trace?: string, obj?: object, arr?: any[]) {
    const formattedMessage = `--------->>  Message: ${message}\nPath: ${path || 'N/A'}\nTrace: ${trace || 'N/A'}\nObject: ${obj ? JSON.stringify(obj) : 'N/A'}\nArray: ${arr ? JSON.stringify(arr) : 'N/A'}`;
    this.logger.verbose(formattedMessage);
  }

  silly(message: string, path?: string, trace?: string, obj?: object, arr?: any[]) {
    const formattedMessage = `--------->>  Message: ${message}\nPath: ${path || 'N/A'}\nTrace: ${trace || 'N/A'}\nObject: ${obj ? JSON.stringify(obj) : 'N/A'}\nArray: ${arr ? JSON.stringify(arr) : 'N/A'}`;
    this.logger.silly(formattedMessage);
  }
}
