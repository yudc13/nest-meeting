import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as winston from 'winston';
import { utilities, WinstonModule } from 'nest-winston';
import { createLogger } from 'winston';
import 'winston-daily-rotate-file';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';

async function bootstrap() {
  const logInstance = createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.ms(),
          utilities.format.nestLike(process.env.APP_NAME, {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
      new winston.transports.DailyRotateFile({
        filename: 'log/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: false,
        maxSize: '20m',
        maxFiles: '7d',
        level: 'error',
        format: winston.format.json(),
      }),
    ],
  });
  const logger = WinstonModule.createLogger({
    instance: logInstance,
  });
  const app = await NestFactory.create(AppModule, { logger });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(3000);
}

bootstrap();
