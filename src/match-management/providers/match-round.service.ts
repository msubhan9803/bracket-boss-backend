import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchRound } from '../entities/matchRound.entity';
import { CreateMatchRoundInputDto } from '../dtos/create-match-round-input.dto';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';

@Injectable()
export class MatchRoundService {
    constructor(
        @InjectRepository(MatchRound)
        private readonly matchRoundRepository: Repository<MatchRound>,
    ) {}

    findMatchRoundsByTournament(
        tournament: Tournament,
        relations: string[] = [
            'matchRoundScores',
        ]
    ): Promise<MatchRound[]> {
        return this.matchRoundRepository.find({
            where: { tournament: { id: tournament.id } },
            relations,
        });
    }
    
    createMatchRound(matchRound: CreateMatchRoundInputDto): Promise<MatchRound> {
        return this.matchRoundRepository.save(matchRound);
    }
}
