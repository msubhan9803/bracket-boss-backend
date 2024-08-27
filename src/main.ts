import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 4000);

  await app
    .listen(port)
    .then(() => console.log(`🚀 App running at: http://localhost:${port}`));
}
bootstrap();
