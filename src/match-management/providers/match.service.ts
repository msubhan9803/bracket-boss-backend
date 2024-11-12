import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from '../entities/match.entity';
import { Repository } from 'typeorm';
import { CreateMatchInputDto } from '../dtos/create-match-input.dto';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
    ) { }

    findMatchesByTournament(
        tournament: Tournament,
        relations: string[] = [
            'awayTeam',
            'awayTeam.users',
            'homeTeam',
            'homeTeam.users',
            'courts'
        ]
    ): Promise<Match[]> {
        return this.matchRepository.find({
            where: { tournament: { id: tournament.id } },
            relations,
        });
    }

    createMatch(match: CreateMatchInputDto): Promise<Match> {
        return this.matchRepository.save(match);
    }
}
