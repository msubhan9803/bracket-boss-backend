import { Injectable } from '@nestjs/common';
import { CourtManagementService } from 'src/court-management/providers/court-management.service';
import { Match } from 'src/match-management/entities/match.entity';
import { MatchRoundService } from 'src/match-management/providers/match-round.service';
import { MatchRoundStatusTypes } from 'src/match-management/types/common';
import { Team } from 'src/team-management/entities/team.entity';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';

@Injectable()
export class SingleEliminationScheduleBuilderService {
    constructor(
        private readonly matchRoundService: MatchRoundService,
        private readonly courtManagementService: CourtManagementService,
    ) { }

    public generateSingleEliminationMatches(teams: Team[]): { title: string; teams: Team[] }[] {
        const createdMatches = [];

        /**
         * Generate matches where each team plays against one opponent
         * For single elimination, we pair teams sequentially
         */
        for (let i = 0; i < teams.length; i += 2) {
            const homeTeam = teams[i];
            const awayTeam = teams[i + 1];

            // Skip if we have an odd number of teams and this is the last team
            if (!awayTeam) {
                // Optionally handle bye for odd number of teams
                continue;
            }

            createdMatches.push({
                title: `Match ${createdMatches.length + 1}`,
                teams: [homeTeam, awayTeam],
            });
        }

        return createdMatches;
    }

    public async createMatchRounds(createdMatches: Match[], tournament: Tournament, bestOfRounds: number) {
        const createdMatchRounds = [];

        for (let index = 0; index < createdMatches.length; index++) {
            const match = createdMatches[index];

            for (let index = 1; index <= bestOfRounds; index++) {
                const createdMatchRound = await this.matchRoundService.createMatchRound({
                    tournament,
                    match,
                    matchRoundNumber: index,
                    status: MatchRoundStatusTypes.not_started
                });

                createdMatchRounds.push(createdMatchRound);
            }
        }

        return createdMatchRounds;
    }
}
