import { Injectable } from '@nestjs/common';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { Club } from 'src/clubs/entities/club.entity';
import { TournamentRoundService } from 'src/tournament-management/providers/tournament-round.service';
import { TeamManagementService } from 'src/team-management/providers/team-management.service';
import { CourtManagementService } from 'src/court-management/providers/court-management.service';
import { MatchService } from 'src/match-management/providers/match.service';
import { MatchStatusService } from 'src/match-management/providers/match-status.service';
import { MatchRoundService } from 'src/match-management/providers/match-round.service';
import { MatchRoundStatusService } from 'src/match-management/providers/match-round-status.service';
import { TeamInput } from '../dtos/create-schedule-input.dto';
import { MatchRoundStatusTypes, MatchStatusTypes } from 'src/match-management/types/common';
import { TimeSlotWithCourts } from 'src/court-management/types';
import { TournamentRound } from 'src/tournament-management/entities/tournamentRound.entity';
import { Team } from 'src/team-management/entities/team.entity';
import { GroupedMatches } from '../types/common';

@Injectable()
export class CreateScheduleHelperService {
    constructor(
        private readonly tournamentRoundService: TournamentRoundService,
        private readonly teamManagementService: TeamManagementService,
        private readonly courtManagementService: CourtManagementService,
        private readonly matchService: MatchService,
        private readonly matchStatusService: MatchStatusService,
        private readonly matchRoundService: MatchRoundService,
        private readonly matchRoundStatusService: MatchRoundStatusService,
    ) { }

    async createTournamentRound(club: Club, tournament: Tournament) {
        return this.tournamentRoundService.createTournamentRound(club, tournament);
    }

    async createTeams(teams: TeamInput[], tournamentId: number, clubId: number) {
        const createdTeams = await Promise.all(
            teams.map((team) =>
                this.teamManagementService.createTeam({
                    name: team.name,
                    userIds: team.userIds,
                    tournamentId,
                    clubId,
                }),
            ),
        );

        // Map createdTeams for quick lookup by userIds
        const teamMap = new Map<string, Team>();
        createdTeams.forEach((team) => {
            const key = JSON.stringify(team.users.map(user => user.id).sort());
            teamMap.set(key, team);
        });

        return teamMap;
    }

    async getAvailableCourts(startDate: Date, endDate: Date) {
        return this.courtManagementService.getCourtsWithSchedule(startDate, endDate);
    }

    async createMatches(
        groupedMatches: GroupedMatches,
        teamMap: Map<string, Team>,
        club: Club,
        tournament: Tournament,
        createdTournamentRound: TournamentRound,
        timeSlotWithCourts: TimeSlotWithCourts[],
    ) {
        let createdMatches = [];
        const notStartedMatchStatus = await this.matchStatusService.findMatchStatusByStatusName(MatchStatusTypes.not_started);

        let availableTimeSlots = [...timeSlotWithCourts];

        for (const groupKey of Object.keys(groupedMatches)) {
            const group = groupedMatches[groupKey];
            const numberOfMatches = group.matches.length;

            const timeSlotIndex = availableTimeSlots.findIndex(ts => ts.courts.length >= numberOfMatches);
            if (timeSlotIndex === -1) {
                throw new Error(`No available time slot with at least ${numberOfMatches} courts found for group ${groupKey}`);
            }

            const [selectedTimeSlot] = availableTimeSlots.splice(timeSlotIndex, 1);

            for (const match of group.matches) {
                const courtId = selectedTimeSlot.courts.shift();
                if (!courtId) {
                    throw new Error(`Insufficient courts in time slot for group ${groupKey}`);
                }

                const selectedCourt = await this.courtManagementService.findOne(courtId);
                if (!selectedCourt) {
                    throw new Error(`Court with ID ${courtId} not found`);
                }

                const homeTeam = teamMap.get(JSON.stringify(match.teams[0].userIds.sort()));
                const awayTeam = teamMap.get(JSON.stringify(match.teams[1].userIds.sort()));

                if (!homeTeam || !awayTeam) {
                    throw new Error("Team not found for one or both match teams");
                }

                const matchDate = new Date(`${selectedTimeSlot.date}T${selectedTimeSlot.startTime}`);

                const matchEntity = {
                    club,
                    tournament,
                    courts: [selectedCourt],
                    matchDate,
                    tournamentRound: createdTournamentRound,
                    homeTeam,
                    awayTeam,
                    statuses: [notStartedMatchStatus],
                };

                const createdMatch = await this.matchService.createMatch(matchEntity as any);

                createdMatches.push(createdMatch)
            }
        }

        return createdMatches;
    }

    async createMatchRounds(
        createdMatches: any[],
        tournament: Tournament,
        club: Club,
        bestOfRounds: number,
    ) {
        const notStartedMatchRoundStatus = await this.matchRoundStatusService.findMatchStatusByStatusName(MatchRoundStatusTypes.not_started);
        let createdMatchRounds = [];

        for (let index = 0; index < createdMatches.length; index++) {
            const match = createdMatches[index];

            for (let index = 1; index <= bestOfRounds; index++) {
                const createdMatchRound = await this.matchRoundService.createMatchRound({
                    club,
                    tournament,
                    match,
                    startTime: match.matchDate,
                    endTime: match.matchDate,
                    matchRoundNumber: index,
                    statuses: [notStartedMatchRoundStatus],
                });

                createdMatchRounds.push(createdMatchRound);
            }
        }

        return createdMatchRounds;
    }
}