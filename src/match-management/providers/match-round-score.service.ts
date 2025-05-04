import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchRoundScore } from '../entities/matchRoundScore.entity';
import { Repository } from 'typeorm';
import { MatchRound } from '../entities/matchRound.entity';

@Injectable()
export class MatchRoundScoreService {
    constructor(
        @InjectRepository(MatchRoundScore)
        private readonly matchRoundScoreRepository: Repository<MatchRoundScore>,
    ) { }

    async createScore(matchRound: MatchRound) {
        const roundScore = this.matchRoundScoreRepository.create({
            matchRound,
            homeTeamScore: 0,
            awayTeamScore: 0
        });
        return this.matchRoundScoreRepository.save(roundScore);
    }

    async updateScore(
        roundId: number,
        homeTeamScore: number,
        awayTeamScore: number
    ): Promise<MatchRoundScore> {
        const score = await this.matchRoundScoreRepository.findOne({
            where: { matchRound: { id: roundId } }
        });

        if (!score) {
            throw new Error('Score not found for this round');
        }

        score.homeTeamScore = homeTeamScore;
        score.awayTeamScore = awayTeamScore;

        return this.matchRoundScoreRepository.save(score);
    }
}
