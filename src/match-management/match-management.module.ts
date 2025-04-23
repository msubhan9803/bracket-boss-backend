import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { MatchRound } from './entities/matchRound.entity';
import { MatchRoundScore } from './entities/matchRoundScore.entity';
import { MatchCommentary } from './entities/matchCommentary.entity';
import { MatchService } from './providers/match.service';
import { MatchRoundService } from './providers/match-round.service';
import { MatchCourtSchedules } from './entities/match-court-schedule.entity';
import { MatctCourtScheduleService } from './providers/matct-court-schedule.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Match,
      MatchCourtSchedules,
      MatchRound,
      MatchRoundScore,
      MatchCommentary,
    ]),
  ],
  providers: [MatchService, MatchRoundService, MatctCourtScheduleService],
  exports: [MatchService, MatchRoundService, MatctCourtScheduleService]
})
export class MatchManagementModule {}