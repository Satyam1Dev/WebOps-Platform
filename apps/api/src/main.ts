import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { setupSwagger } from './config';

async function bootstrap() {
  // Create Nest application
  const app = await NestFactory.create(AppModule);

  // Get configuration service
  const configService = app.get(ConfigService);

  // Application configuration
  const port = configService.get<number>('app.port') ?? 3001;
  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api';
  const apiVersion = configService.get<string>('app.apiVersion') ?? '1';
  const environment =
    configService.get<string>('app.environment') ?? 'development';

  // Global API Prefix
  app.setGlobalPrefix(apiPrefix);

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
  });

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Graceful shutdown for Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Swagger Documentation
  setupSwagger(app);

  // Start application
  await app.listen(port);

  // Console Logs
  console.log('');
  console.log('===================================================');
  console.log('🚀 WebOps Platform API Started Successfully');
  console.log('===================================================');
  console.log(`🌍 Environment : ${environment}`);
  console.log(`🚀 Server      : http://localhost:${port}`);
  console.log(`📡 API         : http://localhost:${port}/${apiPrefix}/v${apiVersion}`);
  console.log(`📚 Swagger     : http://localhost:${port}/${apiPrefix}/docs`);
  console.log('===================================================');
  console.log('');
}

bootstrap();