import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchRound } from '../entities/matchRound.entity';
import { CreateMatchRoundInputDto } from '../dtos/create-match-round-input.dto';
import { MatchRoundStatusTypes } from '../types/common';
import { MatchRoundScoreService } from './match-round-score.service';

@Injectable()
export class MatchRoundService {
  constructor(
    @InjectRepository(MatchRound)
    private readonly matchRoundRepository: Repository<MatchRound>,
    private readonly matchRoundScoreService: MatchRoundScoreService
  ) { }

  createMatchRound(matchRound: CreateMatchRoundInputDto): Promise<MatchRound> {
    return this.matchRoundRepository.save(matchRound);
  }

  findAllRoundsByMatchId(matchId: number) {
    return this.matchRoundRepository.find({
      where: { match: { id: matchId } },
      order: { matchRoundNumber: 'ASC' },
    });
  }

  async findMatchRoundById(roundId: number): Promise<MatchRound> {
    return this.matchRoundRepository.findOne({
      where: { id: roundId },
      relations: ['match',]
    });
  }

  async startMatchRound(matchRound: MatchRound) {
    await this.matchRoundRepository.update(matchRound.id, { status: MatchRoundStatusTypes.in_progress });
    await this.matchRoundScoreService.createScore(matchRound);
    return this.findMatchRoundById(matchRound.id);
  }

  async endMatchRound(roundId: number) {
    const matchRound = await this.matchRoundRepository.findOne({
      where: { id: roundId },
      relations: ['matchRoundScore']
    });

    if (!matchRound?.matchRoundScore) {
      throw new Error('Match round score not found');
    }

    if (matchRound.matchRoundScore.homeTeamScore === 0 && matchRound.matchRoundScore.awayTeamScore === 0) {
      throw new Error('Both teams must have non-zero scores to end the match round');
    }

    await this.matchRoundRepository.update(roundId, {
      status: MatchRoundStatusTypes.completed
    });

    return this.findMatchRoundById(roundId);
  }
}
