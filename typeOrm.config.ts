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
import { Step } from 'src/users-onboarding-steps/entities/step.entity';
import { UserRoleClub } from 'src/user-management/entities/user-role-club.entity';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { Sport } from 'src/sport-management/entities/sport.entity';
import { Bracket } from 'src/bracket-management/entities/bracket.entity';
import { Court } from 'src/court-management/entities/court.entity';

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
  entities: [
    User,
    Club,
    Role,
    Policy,
    Module,
    Action,
    ModulePolicyRole,
    Step,
    UserRoleClub,
    Tournament,
    Sport,
    Bracket,
    Court,
  ],
});
