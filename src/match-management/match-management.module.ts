import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { MatchRound } from './entities/matchRound.entity';
import { MatchRoundScore } from './entities/matchRoundScore.entity';
import { MatchCommentary } from './entities/matchCommentary.entity';
import { MatchService } from './providers/match.service';
import { MatchRoundService } from './providers/match-round.service';
import { MatchCourtSchedules } from './entities/match-court-schedule.entity';
import { MatchCourtScheduleService } from './providers/matct-court-schedule.service';
import { MatchManagementResolver } from './match-management.resolver';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { MatchRoundScoreService } from './providers/match-round-score.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Match,
      MatchCourtSchedules,
      MatchRound,
      MatchRoundScore,
      MatchCommentary,
    ]),
    UsersModule
  ],
  providers: [MatchService, MatchRoundService, MatchCourtScheduleService, MatchManagementResolver, JwtService, MatchRoundScoreService],
  exports: [MatchService, MatchRoundService, MatchCourtScheduleService]
})
export class MatchManagementModule {}