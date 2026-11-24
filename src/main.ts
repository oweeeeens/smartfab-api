import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Every route is served under /api/v1 (API versioning)
  app.setGlobalPrefix('api/v1');

  // Validates every request body/query against its DTO (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties that are not in the DTO
      forbidNonWhitelisted: true, // ...and reject the request if any were sent
      transform: true, // convert payloads into DTO class instances / numbers
    }),
  );

  // Every error is returned in the same JSON format
  app.useGlobalFilters(new AllExceptionsFilter());

  // Shut down cleanly (closes the MySQL connection pool) on Ctrl+C
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
