import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MatchCourtSchedules } from '../entities/match-court-schedule.entity';
import { Match } from '../entities/match.entity';
import { CourtSchedule } from 'src/court-management/entities/court-schedule.entity';
import { MatchWithCourtDto } from 'src/scheduling/dtos/schedule.dto';

@Injectable()
export class MatctCourtScheduleService {
    constructor(
        @InjectRepository(MatchCourtSchedules)
        private matchCourtSchedulesRepository: Repository<MatchCourtSchedules>
    ) { }

    createMatchCourtScheduleRelation(
        match: Match,
        courtSchedule: CourtSchedule,
        matchDate: Date
    ) {
        const matchCourtSchedule = this.matchCourtSchedulesRepository.create({
            match,
            courtSchedule,
            matchDate
        });

        return this.matchCourtSchedulesRepository.save(matchCourtSchedule);
    }

    async deleteMatchCourtSchedules(match: Match) {
        await this.matchCourtSchedulesRepository.delete({ match: { id: match.id } });
    }

    async populateMatchesCourtsInMatches(matches: Match[]): Promise<MatchWithCourtDto[]> {
        const matchIds = matches.map(match => match.id);

        const matchCourtSchedules = await this.matchCourtSchedulesRepository.find({
            where: { match: { id: In(matchIds) } },
            relations: [
                'match',
                'match.club',
                'match.tournament',
                'match.matchRounds',
                'match.tournamentRound',
                'match.homeTeam',
                'match.awayTeam',
                'match.winnerTeam',
                'match.statuses',
                'courtSchedule',
                'courtSchedule.court',
                'courtSchedule.day',
                'courtSchedule.timeSlot'
            ],
        });

        return matches.map(match => {
            const matchCourt = matchCourtSchedules.find(mcs => mcs.match.id === match.id);
            return {
            ...match,
            courtSchedule: matchCourt.courtSchedule || null,
            matchDate: new Date(matchCourt.matchDate)
            } as MatchWithCourtDto;
        }).sort((a, b) => a.matchDate.getTime() - b.matchDate.getTime());
    }
}
