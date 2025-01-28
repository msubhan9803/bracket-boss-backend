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
        private tournamentRoundRepository: Repository<TournamentRound>,
        private tournamentRoundStatusService: TournamentRoundStatusService
    ) { }

    findTournamentRoundsByTournament(tournament: Tournament,
        relations: string[] = [
            'club',
            'tournament',
            'statuses',
            'matches',
            'matches.matchRounds',
            'matches.matchRounds.matchRoundScores',
            'matches.homeTeam',
            'matches.awayTeam',
            'roundFormat'
        ]) {
        return this.tournamentRoundRepository.find({
            where: { tournament: { id: tournament.id } },
            relations,
        });
    }

    async createTournamentRound(club: Club, tournament: Tournament) {
        const currentTournamentRounds = await this.findTournamentRoundsByTournament(tournament);
        const notStartedTournamentRoundStatus = await this.tournamentRoundStatusService.findRoundStatusByStatusName(TournamentRoundStatusTypes.not_started);

        const round = new TournamentRound({
            club,
            tournament,
            roundNumber: currentTournamentRounds.length + 1,
            roundFormat: tournament.format,
            statuses: [notStartedTournamentRoundStatus]
        });

        return this.tournamentRoundRepository.save(round);
    }

    async deleteTournamentRound(tournament: Tournament) {
        await this.tournamentRoundRepository.delete({ tournament: { id: tournament.id } });
    }
}
