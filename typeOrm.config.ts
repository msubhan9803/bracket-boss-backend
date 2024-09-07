import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Club } from './src/clubs/entities/club.entity';
import { Role } from './src/user-management/entities/role.entity';
import { Policy } from './src/user-management/entities/policy.entity';
import { Action } from './src/user-management/entities/action.entity';
import { ModulePolicyRole } from './src/user-management/entities/modules-policies-roles.entity';
import { Module } from 'src/user-management/entities/module.entity';

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
  entities: [User, Club, Role, Policy, Module, Action, ModulePolicyRole],
});
