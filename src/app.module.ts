import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validateEnvVariables } from './config/env.validation';
import configuration from './config/configuration';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      validate: validateEnvVariables,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
