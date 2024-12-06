import { Module } from '@nestjs/common';
import { SchedulingService } from './providers/scheduling.service';
import { SchedulingResolver } from './scheduling.resolver';
import { TournamentManagementModule } from 'src/tournament-management/tournament-management.module';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { RoundRobinStrategy } from './strategies/round-robin.format.strategy';
import { StrategyTypes } from 'src/common/types/global';
import { BlindDrawTeamGenerationStrategy } from './strategies/blind-draw.team-generation.strategy';
import { SplitSwitchTeamGenerationStrategy } from './strategies/split-switch.team-generation.strategy';
import { ClubsModule } from 'src/clubs/clubs.module';
import { TeamManagementModule } from 'src/team-management/team-management.module';
import { CourtManagementModule } from 'src/court-management/court-management.module';
import { MatchManagementModule } from 'src/match-management/match-management.module';
import { ScheduleSpreadsheetHandlerService } from './providers/schedule-spreadsheet-handler.service';

@Module({
  imports: [TournamentManagementModule, UsersModule, ClubsModule, TeamManagementModule, CourtManagementModule, MatchManagementModule],
  providers: [
    SchedulingService,
    SchedulingResolver,
    JwtService,
    {
      provide: StrategyTypes.FORMAT_STRATEGIES,
      useFactory: () => [new RoundRobinStrategy()],
    },
    {
      provide: StrategyTypes.TEAM_GENERATION_STRATEGIES,
      useFactory: () => [
        new BlindDrawTeamGenerationStrategy(),
        new SplitSwitchTeamGenerationStrategy(),
      ],
    },
    ScheduleSpreadsheetHandlerService,
  ],
})
export class SchedulingModule {}
