import { Module } from '@nestjs/common';
import { SchedulingService } from './providers/scheduling.service';
import { SchedulingResolver } from './scheduling.resolver';
import { JwtService } from '@nestjs/jwt';

import { TournamentManagementModule } from 'src/tournament-management/tournament-management.module';
import { UsersModule } from 'src/users/users.module';
import { ClubsModule } from 'src/clubs/clubs.module';
import { TeamManagementModule } from 'src/team-management/team-management.module';
import { CourtManagementModule } from 'src/court-management/court-management.module';
import { MatchManagementModule } from 'src/match-management/match-management.module';
import { ScheduleSpreadsheetHandlerService } from './providers/schedule-spreadsheet-handler.service';
import { RoundRobinScheduleBuilderService } from './providers/round-robin-schedule-builder.service';
import { LevelModule } from 'src/level/level.module';
import { PoolModule } from 'src/pool/pool.module';
import { RoundModule } from 'src/round/round.module';

import { StrategyTypes } from 'src/common/types/global';
import { RoundRobinStrategy } from './strategies/round-robin.format.strategy';
import { BlindDrawTeamGenerationStrategy } from './strategies/blind-draw.team-generation.strategy';
import { SplitSwitchTeamGenerationStrategy } from './strategies/split-switch.team-generation.strategy';
import { SingleEliminationStrategy } from './strategies/single-elimination.format.strategy';
import { SingleEliminationScheduleBuilderService } from './providers/single-elimination-schedule-builder.service';

@Module({
  imports: [
    TournamentManagementModule,
    UsersModule,
    ClubsModule,
    TeamManagementModule,
    CourtManagementModule,
    MatchManagementModule,
    LevelModule,
    PoolModule,
    RoundModule,
  ],
  providers: [
    SchedulingService,
    SchedulingResolver,
    JwtService,
    ScheduleSpreadsheetHandlerService,
    RoundRobinScheduleBuilderService,

    /**
     * Inject strategy classes
     */
    RoundRobinStrategy,
    SingleEliminationStrategy,
    BlindDrawTeamGenerationStrategy,
    SplitSwitchTeamGenerationStrategy,

    /**
     * Aggregate format strategies
     */
    {
      provide: StrategyTypes.FORMAT_STRATEGIES,
      useFactory: (roundRobin: RoundRobinStrategy, singleElimination: SingleEliminationStrategy) => [roundRobin, singleElimination],
      inject: [RoundRobinStrategy, SingleEliminationStrategy],
    },

    /**
     * Aggregate team generation strategies
     */
    {
      provide: StrategyTypes.TEAM_GENERATION_STRATEGIES,
      useFactory: (
        blindDraw: BlindDrawTeamGenerationStrategy,
        splitSwitch: SplitSwitchTeamGenerationStrategy,
      ) => [blindDraw, splitSwitch],
      inject: [BlindDrawTeamGenerationStrategy, SplitSwitchTeamGenerationStrategy],
    },

    SingleEliminationScheduleBuilderService,
  ],
})
export class SchedulingModule { }
