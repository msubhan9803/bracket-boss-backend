import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TournamentRound } from '../entities/tournamentRound.entity';
import { Repository } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';
import { TournamentRoundStatusTypes } from '../types/common';
import { TournamentRoundStatusService } from './tournament-round-status.service';
import { Club } from 'src/clubs/entities/club.entity';

@Injectable()
export class TournamentRoundService {
    constructor(
        @InjectRepository(TournamentRound)
        private tournamentRepository: Repository<TournamentRound>,
        private tournamentRoundStatusService: TournamentRoundStatusService
    ) { }

    findRoundsByTournamentId(tournament: Tournament) {
        return this.tournamentRepository.find({
            where: { tournament },
        });
    }

    async createTournamentRound(club: Club, tournament: Tournament) {
        const currentTournamentRounds = await this.findRoundsByTournamentId(tournament);
        const notStartedTournamentRoundStatus = await this.tournamentRoundStatusService.findRoundStatusByStatusName(TournamentRoundStatusTypes.not_started);

        const round = new TournamentRound({
            club,
            tournament,
            roundNumber: currentTournamentRounds.length + 1,
            roundFormat: tournament.format,
            statuses: [notStartedTournamentRoundStatus]
        });

        return this.tournamentRepository.save(round);
    }
}
