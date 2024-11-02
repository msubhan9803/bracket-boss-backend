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

@Module({
  imports: [TournamentManagementModule, UsersModule],
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
  ],
})
export class SchedulingModule {}
