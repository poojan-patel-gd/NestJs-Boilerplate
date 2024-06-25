import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { PrismaInterceptor } from './interceptors/prisma.interceptor';
import * as path from 'path';
import * as compression from 'compression';
import {CustomExceptionFilter} from "./filters/custom-exception.filter";
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
  });

  app.enableCors();
  app.setGlobalPrefix('/api');
  app.useGlobalFilters(
    // TODO: uncomment when ready
    // new GlobalExceptionFilter(),

    // new InvalidFormExceptionFilter(),
    new CustomExceptionFilter(),
  );
  app.useGlobalInterceptors(new PrismaInterceptor());
  app.use(compression());
  app.use('/images', express.static('images'));
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
  // app.use(bodyParser.json({ limit: '50mb' })); // Increase the JSON payload limit to 50mb
  // app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Increase the URL-encoded payload limit to 50mb
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Test')
    .setDescription('The Test API description...')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Test',
    swaggerOptions: {
      docExpansion: 'none', // or 'list' or 'full'
      showRequestDuration: true,
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, customOptions);

  await app.listen(process.env.PORT);
}

bootstrap();
