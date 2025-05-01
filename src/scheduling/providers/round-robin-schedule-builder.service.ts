import { Injectable } from '@nestjs/common';
import { DrafRoundsWithMatches, DraftMatch, DraftMatchToAvailableSchedulesMapping } from '../types/common';
import { Team } from 'src/team-management/entities/team.entity';
import { Round } from 'src/round/entities/round.entity';
import { TimeSlotWithCourts } from 'src/court-management/types';
import messages from 'src/utils/messages';
import { RoundService } from 'src/round/providers/round.service';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { Pool } from 'src/pool/entities/pool.entity';
import { CourtScheduleService } from 'src/court-management/providers/court-schedule.service';
import { MatchService } from 'src/match-management/providers/match.service';
import { MatchStatusTypes } from 'src/match-management/types/common';
import { MatchCourtScheduleService } from 'src/match-management/providers/matct-court-schedule.service';
import { MatchRoundService } from 'src/match-management/providers/match-round.service';
import { CourtManagementService } from 'src/court-management/providers/court-management.service';
import { RoundStatusTypesEnum } from 'src/common/types/global';

@Injectable()
export class RoundRobinScheduleBuilderService {
  constructor(
    private readonly roundService: RoundService,
    private readonly courtScheduleService: CourtScheduleService,
    private readonly matchService: MatchService,
    private readonly matchCourtScheduleService: MatchCourtScheduleService,
    private readonly matchRoundService: MatchRoundService,
    private readonly courtManagementService: CourtManagementService,
  ) {}

  async generateRoundsMatches(tournament: Tournament, pool: Pool, teams: Team[]): Promise<Round[]> {
    const draftMatchList = this.generateRoundRobinMatches(teams);
    const draftedRoundsWithMatches = this.draftOutRoundsWithMatches(draftMatchList);

    let roundList: Round[] = [];

    const timeSlotWithCourts = await this.getAvailableCourts(tournament.start_date, tournament.end_date);

    for (let index = 0; index < Object.keys(draftedRoundsWithMatches).length; index++) {
      const roundKey = Object.keys(draftedRoundsWithMatches)[index];
      const roundMatches = draftedRoundsWithMatches[roundKey];
      const round = await this.roundService.createRound({
        name: `Round ${index + 1}`,
        tournament,
        pool,
        order: index + 1,
        status: RoundStatusTypesEnum.not_started,
      });

      let createdMatches = [];

      const matchTimeslotMapping = this.validateAndAssignTimeslots(
        {
          [roundKey]: roundMatches,
        },
        timeSlotWithCourts,
      );

      for (const [match, courtScheduleElem] of matchTimeslotMapping.entries()) {
        const { courtScheduleId, date, startTime } = courtScheduleElem;
        const courtSchedule = await this.courtScheduleService.findOneByID(courtScheduleId);

        const homeTeam = match.teams[0];
        const awayTeam = match.teams[1];

        if (!homeTeam || !awayTeam) {
          throw new Error(messages.TEAM_NOT_FOUND_FOR_MATCH);
        }

        const matchDate = new Date(`${date}T${startTime}`);

        const createdMatch = await this.matchService.createMatch({
          title: match.title,
          tournament,
          homeTeam,
          awayTeam,
          status: MatchStatusTypes.not_started,
          round,
        });
        createdMatches.push(createdMatch);

        await this.matchCourtScheduleService.createMatchCourtScheduleRelation(createdMatch, courtSchedule, matchDate);
      }

      await this.createMatchRounds(createdMatches, tournament, tournament.matchBestOfRounds);

      roundList.push({
        ...round,
        matches: createdMatches,
      });
    }

    return roundList;
  }

  private draftOutRoundsWithMatches(matches: DraftMatch[]): DrafRoundsWithMatches {
    let roundsWithMatches: { [key: string]: { matches: DraftMatch[] } } = {
      round1: {
        matches: [],
      },
    };

    for (let index = 0; index < matches.length; index++) {
      const currentMatch = matches[index];
      const userIds = this.getMatchUserIds(currentMatch);

      for (let groupIndex = 0; groupIndex < Object.keys(roundsWithMatches).length; groupIndex++) {
        const groupKey = Object.keys(roundsWithMatches)[groupIndex];
        const groupMatches = roundsWithMatches[groupKey].matches;

        /**
         * Check if any user from current match exists in group matches
         */
        const doesAnyCurrentUserAlreadyPlaying = groupMatches.some((groupMatch) =>
          userIds.some((userId) => this.getMatchUserIds(groupMatch).includes(userId)),
        );

        if (!doesAnyCurrentUserAlreadyPlaying) {
          // Adding to current group
          roundsWithMatches[groupKey] = {
            matches: [...roundsWithMatches[groupKey].matches, currentMatch],
          };
          break;
        } else if (Object.keys(roundsWithMatches).length === groupIndex + 1) {
          // Adding to new group
          roundsWithMatches[`round${Object.keys(roundsWithMatches).length + 1}`] = {
            matches: [currentMatch],
          };
          break;
        }
      }
    }

    Object.keys(roundsWithMatches).forEach((groupKey) => {
      roundsWithMatches[groupKey].matches.sort(
        (a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime(),
      );
    });

    return roundsWithMatches;
  }

  private generateRoundRobinMatches(teams: Team[]): { title: string; teams: Team[] }[] {
    const matches = [];

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({
          title: `Match ${matches.length + 1}`,
          teams: [teams[i], teams[j]],
        });
      }
    }

    return matches;
  }

  private getMatchUserIds(match: DraftMatch): number[] {
    return match.teams.map((team) => team.users.map((user) => user.id).flat()).flat();
  }

  private validateAndAssignTimeslots(
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

  private async createMatchRounds(createdMatches: any[], tournament: Tournament, bestOfRounds: number) {
    let createdMatchRounds = [];

    for (let index = 0; index < createdMatches.length; index++) {
      const match = createdMatches[index];

      for (let index = 1; index <= bestOfRounds; index++) {
        const createdMatchRound = await this.matchRoundService.createMatchRound({
          tournament,
          match,
          startTime: match.matchDate,
          endTime: match.matchDate,
          matchRoundNumber: index,
        });

        createdMatchRounds.push(createdMatchRound);
      }
    }

    return createdMatchRounds;
  }

  private async getAvailableCourts(startDate: Date, endDate: Date) {
    return this.courtManagementService.getCourtsGroupedByScheduleTimeslots(startDate, endDate);
  }
}
