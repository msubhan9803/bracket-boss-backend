import { Injectable } from '@nestjs/common';
import { DrafRoundsWithMatches, DraftMatch, DraftMatchToAvailableSchedulesMapping } from '../types/common';
import { Team } from 'src/team-management/entities/team.entity';
import { TimeSlotWithCourts } from 'src/court-management/types';
import messages from 'src/utils/messages';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { MatchRoundStatusTypes } from 'src/match-management/types/common';
import { MatchRoundService } from 'src/match-management/providers/match-round.service';
import { CourtManagementService } from 'src/court-management/providers/court-management.service';

@Injectable()
export class RoundRobinScheduleBuilderService {
  constructor(
    private readonly matchRoundService: MatchRoundService,
    private readonly courtManagementService: CourtManagementService,
  ) {}

  public draftOutRoundsWithMatches(matches: DraftMatch[]): DrafRoundsWithMatches {
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

  public generateRoundRobinMatches(teams: Team[]): { title: string; teams: Team[] }[] {
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

  public getMatchUserIds(match: DraftMatch): number[] {
    return match.teams.map((team) => team.users.map((user) => user.id).flat()).flat();
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

  public async createMatchRounds(createdMatches: any[], tournament: Tournament, bestOfRounds: number) {
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
          status: MatchRoundStatusTypes.not_started
        });

        createdMatchRounds.push(createdMatchRound);
      }
    }

    return createdMatchRounds;
  }

  public async getAvailableCourts(startDate: Date, endDate: Date) {
    return this.courtManagementService.getCourtsGroupedByScheduleTimeslots(startDate, endDate);
  }
}
