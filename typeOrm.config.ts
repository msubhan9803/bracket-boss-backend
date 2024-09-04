import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './src/users/enities/user.entity';
import { DataSource } from 'typeorm';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
config({ path: envFilePath });

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow<string>('DB_HOST'),
  port: configService.getOrThrow<number>('DB_PORT'),
  username: configService.getOrThrow<string>('DB_USERNAME'),
  password: configService.getOrThrow<string>('DB_PASSWORD'),
  database: configService.getOrThrow<string>('DB_NAME'),
  migrations: ['migrations/**'],
  entities: [User],
});
