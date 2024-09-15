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
    origin: ['http://localhost:3000/'],
  });
  app.useGlobalPipes(new ValidationPipe());

  await app
    .listen(port)
    .then(() =>
      console.log(
        `🚀 Apollo server running at: http://localhost:${port}/graphql`,
      ),
    );
}
bootstrap();
