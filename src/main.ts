import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });
  const config = app.get(ConfigService);
  const port = config.get<number>('APP_PORT', 4000);

  app.enableCors({
    origin: ['*'],
  });
  app.useGlobalPipes(new ValidationPipe());

  await app
    .listen(port)
    .then(() => console.log(`🚀 App running at: http://localhost:${port}`));
}
bootstrap();
