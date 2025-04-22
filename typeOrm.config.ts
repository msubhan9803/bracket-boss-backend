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
import { Format } from 'src/format-management/entities/format.entity';
import { Court } from 'src/court-management/entities/court.entity';
import { Team } from 'src/team-management/entities/team.entity';
import { TeamGenerationType } from 'src/team-generation-type-management/entities/team-generation-type.entity';
import { Match } from 'src/match-management/entities/match.entity';
import { MatchStatus } from 'src/match-management/entities/matchStatus.entity';
import { MatchRound } from 'src/match-management/entities/matchRound.entity';
import { MatchRoundStatus } from 'src/match-management/entities/matchRoundStatus.entity';
import { MatchRoundScore } from 'src/match-management/entities/matchRoundScore.entity';
import { TeamStatus } from 'src/team-management/entities/teamStatus.entity';
import { MatchCommentary } from 'src/match-management/entities/matchCommentary.entity';
import { Day } from 'src/common/entities/day.entity';
import { TimeSlot } from 'src/common/entities/time-slot.entity';
import { CourtSchedule } from 'src/court-management/entities/court-schedule.entity';
import { MatchCourtSchedules } from 'src/match-management/entities/match-court-schedule.entity';
import { Level } from 'src/level/entities/level.entity';
import { Pool } from 'src/pool/entities/pool.entity';
import { Round } from 'src/round/entities/round.entity';

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
    Format,
    Level,
    Pool,
    Round,
    Court,
    Team,
    TeamStatus,
    TeamGenerationType,
    Tournament,
    Match,
    MatchCourtSchedules,
    MatchStatus,
    MatchRound,
    MatchRoundStatus,
    MatchRoundScore,
    MatchCommentary,
    Day,
    TimeSlot,
    CourtSchedule
  ],
});
