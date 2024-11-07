import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { MatchStatus } from './entities/matchStatus.entity';
import { MatchRound } from './entities/matchRound.entity';
import { MatchRoundStatus } from './entities/matchRoundStatus.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Match,
      MatchStatus,
      MatchRound,
      MatchRoundStatus,
    ]),
  ],
})
export class MatchManagementModule {}
