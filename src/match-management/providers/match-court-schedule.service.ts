import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MatchCourtSchedules } from '../entities/match-court-schedule.entity';
import { Match } from '../entities/match.entity';
import { CourtSchedule } from 'src/court-management/entities/court-schedule.entity';
import { MatchWithCourtDto } from 'src/scheduling/dtos/schedule.dto';
import { TimeSlotWithCourts } from 'src/court-management/types';
import { DrafRoundsWithMatches, DraftMatchToAvailableSchedulesMapping, DraftMatch } from 'src/scheduling/types/common';
import messages from 'src/utils/messages';

@Injectable()
export class MatchCourtScheduleService {
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
                'match.tournament',
                'match.matchRounds',
                'match.homeTeam',
                'match.awayTeam',
                'match.winnerTeam',
                'match.matchCourtSchedule',
                'match.matchCourtSchedule.court',
                'match.matchCourtSchedule.day',
                'match.matchCourtSchedule.timeSlot'
            ],
        });

        const sortedMatches = matches.map(match => {
            const matchCourt = matchCourtSchedules.find(mcs => mcs.match.id === match.id);
            return {
                ...match,
                courtSchedule: matchCourt.courtSchedule || null,
                matchDate: new Date(matchCourt.matchDate)
            } as MatchWithCourtDto;
        }).sort((a, b) => {
            const dateComparison = a.matchDate.getTime() - b.matchDate.getTime();
            if (dateComparison !== 0) return dateComparison;

            const aTime = a.courtSchedule?.timeSlot?.startTime || '';
            const bTime = b.courtSchedule?.timeSlot?.startTime || '';
            return aTime.localeCompare(bTime);
        });

        return sortedMatches;
    }

    public validateAndAssignTimeslots(
      groupedMatches: DrafRoundsWithMatches,
      availableTimeSlots: TimeSlotWithCourts[],
    ): DraftMatchToAvailableSchedulesMapping {
      const assignedMatches = new Map<
        DraftMatch,
        {
          courtScheduleId: number;
          date: string;
          startTime: string;
          endTime: string;
        }
      >();
  
      for (let index = 0; index < Object.keys(groupedMatches).length; index++) {
        const groupKey = Object.keys(groupedMatches)[index];
        const group = groupedMatches[groupKey];
  
        for (let i = 0; i < group.matches.length; i += 1) {
          const match = group.matches[i];
          let courtScheduleId = availableTimeSlots[0]?.courtSchedules?.shift() as number;
  
          if (!courtScheduleId) {
            availableTimeSlots.shift();
  
            courtScheduleId = availableTimeSlots[0]?.courtSchedules?.shift() as number;
            if (!availableTimeSlots[0] || !courtScheduleId) {
              throw new Error(messages.RAN_OUT_OF_TIMESLOTS);
            }
          }
  
          assignedMatches.set(match, {
            courtScheduleId: courtScheduleId,
            date: availableTimeSlots[0].date,
            startTime: availableTimeSlots[0].startTime,
            endTime: availableTimeSlots[0].endTime,
          });
        }
  
        availableTimeSlots.shift();
      }
  
      return assignedMatches;
    }
}
