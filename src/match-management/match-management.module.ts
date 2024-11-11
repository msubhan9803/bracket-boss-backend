import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { MatchStatus } from './entities/matchStatus.entity';
import { MatchRound } from './entities/matchRound.entity';
import { MatchRoundStatus } from './entities/matchRoundStatus.entity';
import { MatchRoundScore } from './entities/matchRoundScore';
import { MatchCommentary } from './entities/matchCommentary.entity';
import { MatchService } from './providers/match.service';
import { MatchStatusService } from './providers/match-status.service';
import { MatchRoundService } from './providers/match-round.service';
import { MatchRoundStatusService } from './providers/match-round-status.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Match,
      MatchStatus,
      MatchRound,
      MatchRoundScore,
      MatchRoundStatus,
      MatchCommentary,
    ]),
  ],
  providers: [MatchService, MatchStatusService, MatchRoundService, MatchRoundStatusService],
  exports: [MatchService, MatchStatusService, MatchRoundService, MatchRoundStatusService]
})
export class MatchManagementModule {}
