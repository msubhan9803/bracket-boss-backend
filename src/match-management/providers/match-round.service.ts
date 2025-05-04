import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchRound } from '../entities/matchRound.entity';
import { CreateMatchRoundInputDto } from '../dtos/create-match-round-input.dto';
import { MatchRoundStatusTypes } from '../types/common';
import { MatchRoundScore } from '../entities/matchRoundScore.entity';

@Injectable()
export class MatchRoundService {
  constructor(
    @InjectRepository(MatchRound)
    private readonly matchRoundRepository: Repository<MatchRound>,
    @InjectRepository(MatchRoundScore)
    private readonly matchRoundScoreRepository: Repository<MatchRoundScore>,
  ) {}

  createMatchRound(matchRound: CreateMatchRoundInputDto): Promise<MatchRound> {
    return this.matchRoundRepository.save(matchRound);
  }

  findAllRoundsByMatchId(matchId: number) {
    return this.matchRoundRepository.find({
      where: { match: { id: matchId } },
      order: { matchRoundNumber: 'ASC' },
    });
  }

  async startMatchRound(matchRound: MatchRound) {
    await this.matchRoundRepository.update(matchRound.id, { status: MatchRoundStatusTypes.in_progress });

    const roundScore = this.matchRoundScoreRepository.create({
        matchRound,
        homeTeamScore: 0,
        awayTeamScore: 0
    });

    return this.matchRoundScoreRepository.save(roundScore);
  }
}
