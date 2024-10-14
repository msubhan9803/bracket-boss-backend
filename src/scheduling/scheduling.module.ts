import { Module } from '@nestjs/common';
import { SchedulingService } from './providers/scheduling.service';
import { SchedulingResolver } from './scheduling.resolver';
import { TournamentManagementModule } from 'src/tournament-management/tournament-management.module';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { RoundRobinTeamBasedStrategy } from './strategies/round-robin-team-based.strategy';
import { StrategyTypes } from 'src/common/types/global';
import { RoundRobinPlayerBasedStrategy } from './strategies/round-robin-player-based.strategy';

@Module({
  imports: [TournamentManagementModule, UsersModule],
  providers: [
    SchedulingService,
    SchedulingResolver,
    JwtService,
    {
      provide: StrategyTypes.BRACKET_STRATEGIES,
      useFactory: () => [
        new RoundRobinTeamBasedStrategy(),
        new RoundRobinPlayerBasedStrategy(),
      ],
    },
  ],
})
export class SchedulingModule {}
