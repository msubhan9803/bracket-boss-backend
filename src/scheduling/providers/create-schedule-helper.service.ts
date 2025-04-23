import { Injectable } from '@nestjs/common';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { TeamManagementService } from 'src/team-management/providers/team-management.service';
import { CourtManagementService } from 'src/court-management/providers/court-management.service';
import { MatchService } from 'src/match-management/providers/match.service';
import { MatchRoundService } from 'src/match-management/providers/match-round.service';
import { MatchInput, TeamInput } from '../dtos/create-schedule-input.dto';
import { MatchStatusTypes } from 'src/match-management/types/common';
import { TimeSlotWithCourts } from 'src/court-management/types';
import { Team } from 'src/team-management/entities/team.entity';
import { GroupedMatches } from '../types/common';
import { MatctCourtScheduleService } from 'src/match-management/providers/matct-court-schedule.service';
import { CourtScheduleService } from 'src/court-management/providers/court-schedule.service';
import messages from 'src/utils/messages';

@Injectable()
export class CreateScheduleHelperService {
  constructor(
    private readonly teamManagementService: TeamManagementService,
    private readonly courtManagementService: CourtManagementService,
    private readonly matchService: MatchService,
    private readonly matchRoundService: MatchRoundService,
    private readonly matctCourtScheduleService: MatctCourtScheduleService,
    private readonly courtScheduleService: CourtScheduleService,
  ) {}

  /**
   * Creates teams based on the provided team inputs and associates them with a tournament and club.
   * @param teams - An array of team inputs containing team details.
   * @param tournamentId - The ID of the tournament the teams belong to.
   * @returns A map of teams, keyed by a stringified sorted array of user IDs.
   */
  async createTeams(teams: TeamInput[], tournamentId: number) {
    const createdTeams = await Promise.all(
      teams.map((team) =>
        this.teamManagementService.createTeam({
          name: team.name,
          userIds: team.userIds,
          tournamentId,
        }),
      ),
    );

    const teamMap = new Map<string, Team>();
    createdTeams.forEach((team) => {
      const key = JSON.stringify(team.users.map((user) => user.id).sort());
      teamMap.set(key, team);
    });

    return teamMap;
  }

  /**
   * Retrieves available courts within a specified date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A list of courts with their schedules within the specified date range.
   */
  async getAvailableCourts(startDate: Date, endDate: Date) {
    return this.courtManagementService.getCourtsGroupedByScheduleTimeslots(
      startDate,
      endDate,
    );
  }

  /**
   * Creates matches for a tournament based on grouped matches, available courts, and teams.
   * @param groupedMatches - Matches grouped by a specific key (e.g., group or round).
   * @param teamMap - A map of teams keyed by a stringified sorted array of user IDs.
   * @param club - The club associated with the tournament.
   * @param tournament - The tournament for which matches are being created.
   * @param createdTournamentRound - The tournament round associated with the matches.
   * @param timeSlotWithCourts - Available time slots with associated courts.
   * @returns A list of created matches.
   */
  async createMatches(
    groupedMatches: GroupedMatches,
    teamMap: Map<string, Team>,
    tournament: Tournament,
    timeSlotWithCourts: TimeSlotWithCourts[],
  ) {
    try {
      let createdMatches = [];

      const assignedTimeSlots = this.validateAndAssignTimeslots(
        groupedMatches,
        timeSlotWithCourts,
      );

      for (const [match, courtScheduleElem] of assignedTimeSlots.entries()) {
        const { courtScheduleId, date, startTime } = courtScheduleElem;
        const courtSchedule =
          await this.courtScheduleService.findOneByID(courtScheduleId);

        const homeTeam = teamMap.get(
          JSON.stringify(match.teams[0].userIds.sort()),
        );
        const awayTeam = teamMap.get(
          JSON.stringify(match.teams[1].userIds.sort()),
        );

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
        });
        createdMatches.push(createdMatch);

        // Assigning Court to Match for the given match date
        await this.matctCourtScheduleService.createMatchCourtScheduleRelation(
          createdMatch,
          courtSchedule,
          matchDate,
        );
      }

      return createdMatches;
    } catch (error) {
      console.log('❌ Error: ', error);
    }
  }

  /**
   * Creates match rounds for a list of matches, based on the best-of-rounds format.
   * @param createdMatches - A list of matches for which rounds are being created.
   * @param tournament - The tournament associated with the matches.
   * @param club - The club associated with the tournament.
   * @param bestOfRounds - The number of rounds to create for each match (best-of format).
   * @returns A list of created match rounds.
   */
  async createMatchRounds(
    createdMatches: any[],
    tournament: Tournament,
    bestOfRounds: number,
  ) {
    let createdMatchRounds = [];

    for (let index = 0; index < createdMatches.length; index++) {
      const match = createdMatches[index];

      for (let index = 1; index <= bestOfRounds; index++) {
        const createdMatchRound = await this.matchRoundService.createMatchRound(
          {
            tournament,
            match,
            startTime: match.matchDate,
            endTime: match.matchDate,
            matchRoundNumber: index,
          },
        );

        createdMatchRounds.push(createdMatchRound);
      }
    }

    return createdMatchRounds;
  }

  /**
   * Validates and assigns timeslots to matches in grouped matches.
   *
   * @param groupedMatches - An object where the keys are group identifiers and the values are objects containing match information.
   * @param availableTimeSlots - An array of time slots with associated courts.
   * @returns A Map where the keys are matches and the values are assigned timeslot IDs.
   * @throws Will throw an error if there are no available timeslots left to assign.
   */
  validateAndAssignTimeslots(
    groupedMatches: GroupedMatches,
    availableTimeSlots: TimeSlotWithCourts[],
  ) {
    const assignedMatches = new Map<
      MatchInput,
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
        let courtScheduleId =
          availableTimeSlots[0]?.courtSchedules?.shift() as number;

        if (!courtScheduleId) {
          availableTimeSlots.shift();

          courtScheduleId =
            availableTimeSlots[0]?.courtSchedules?.shift() as number;
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
