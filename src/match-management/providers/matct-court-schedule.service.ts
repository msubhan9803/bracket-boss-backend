import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchCourtSchedules } from '../entities/match-court-schedule.entity';
import { Match } from '../entities/match.entity';
import { CourtSchedule } from 'src/court-management/entities/court-schedule.entity';

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
}
