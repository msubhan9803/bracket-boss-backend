import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { MatchStatus } from './entities/matchStatus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, MatchStatus])],
})
export class MatchManagementModule {}
