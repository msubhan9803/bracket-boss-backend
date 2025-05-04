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
      relations: ['match']
    });
  }

  async startMatchRound(matchRound: MatchRound) {
    await this.matchRoundRepository.update(matchRound.id, { status: MatchRoundStatusTypes.in_progress });
    return this.matchRoundScoreService.createScore(matchRound);
  }
}
