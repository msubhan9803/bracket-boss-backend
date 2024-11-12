import { Inject, Injectable } from '@nestjs/common';
import { FormatStrategy } from '../interface/format-strategy.interface';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { StrategyTypes } from 'src/common/types/global';
import { Match as MatchEntity, Team as TeamEntityType } from '../types/common';
import { TeamGenerationStrategy } from '../interface/team-generation-strategy.interface';
import { UsersService } from 'src/users/providers/users.service';
import { CreateScheduleInputDto } from '../dtos/create-schedule-input.dto';
import { CreateScheduleResponseDto } from '../dtos/create-schedule-response.dto';
import { TournamentManagementService } from 'src/tournament-management/providers/tournament-management.service';
import { TournamentRoundService } from 'src/tournament-management/providers/tournament-round.service';
import { ClubsService } from 'src/clubs/providers/clubs.service';
import { TeamManagementService } from 'src/team-management/providers/team-management.service';
import { CourtManagementService } from 'src/court-management/providers/court-management.service';
import { MatchService } from 'src/match-management/providers/match.service';
import { MatchStatusService } from 'src/match-management/providers/match-status.service';
import { MatchRoundStatusTypes, MatchStatusTypes } from 'src/match-management/types/common';
import { MatchRoundService } from 'src/match-management/providers/match-round.service';
import { MatchRoundStatusService } from 'src/match-management/providers/match-round-status.service';

@Injectable()
export class SchedulingService {
  private formatStrategies: { [key: string]: FormatStrategy };
  private teamGenerationStrategies: { [key: string]: TeamGenerationStrategy };

  constructor(
    @Inject(StrategyTypes.FORMAT_STRATEGIES)
    formatStrategies: FormatStrategy[],
    @Inject(StrategyTypes.TEAM_GENERATION_STRATEGIES)
    teamGenerationStrategies: TeamGenerationStrategy[],
    private usersService: UsersService,
    private readonly tournamentManagementService: TournamentManagementService,
    private readonly tournamentRoundService: TournamentRoundService,
    private readonly clubsService: ClubsService,
    private readonly teamManagementService: TeamManagementService,
    private readonly courtManagementService: CourtManagementService,
    private readonly matchService: MatchService,
    private readonly matchStatusService: MatchStatusService,
    private readonly matchRoundService: MatchRoundService,
    private readonly matchRoundStatusService: MatchRoundStatusService,
  ) {
    this.formatStrategies = formatStrategies.reduce((acc, strategy) => {
      acc[strategy.type] = strategy;
      return acc;
    }, {});
    this.teamGenerationStrategies = teamGenerationStrategies.reduce(
      (acc, strategy) => {
        acc[strategy.type] = strategy;
        return acc;
      },
      {},
    );
  }

  private getStrategy(
    formatName: string,
    teamGenerationTypeName: string,
  ): {
    formatStrategy: FormatStrategy;
    teamGenerationStrategy: TeamGenerationStrategy;
  } {
    const formatStrategy = this.formatStrategies[formatName];
    if (!formatStrategy) {
      throw new Error('Invalid strategy type');
    }
    const teamGenerationStrategy =
      this.teamGenerationStrategies[teamGenerationTypeName];
    if (!teamGenerationStrategy) {
      throw new Error('Invalid strategy type');
    }

    return { formatStrategy, teamGenerationStrategy };
  }

  async generateTeamsBasedOnStrategy(
    tournament: Tournament,
    userIds: number[],
  ): Promise<{ matches: MatchEntity[]; teams: TeamEntityType[] }> {
    const { formatStrategy, teamGenerationStrategy } = this.getStrategy(
      tournament.format.name,
      tournament.teamGenerationType.name,
    );

    const users = await this.usersService.findUsersWithRelationsByUserIds(
      userIds,
      [],
    );

    const teams = await teamGenerationStrategy.generateTeams(users, {
      groupBy: tournament.splitSwitchGroupBy,
    });
    const matches = await formatStrategy.generateMatches(teams);

    return { matches, teams };
  }

  async createSchedule(createScheduleInputDto: CreateScheduleInputDto): Promise<CreateScheduleResponseDto> {
    const { tournamentId, clubId, matches } = createScheduleInputDto;

    const club = await this.clubsService.findOne(clubId);
    const tournament = await this.tournamentManagementService.findOneWithRelations(tournamentId);

    /**
     * Create a tournament round
     */
    const createdTournamentRound = await this.tournamentRoundService.createTournamentRound(club, tournament);

    /**
     * Create Teams
     */
    const teams = matches.map((match) => match.teams).flat();
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
    const teamMap = new Map<string, typeof createdTeams[0]>();
    createdTeams.forEach((team) => {
      const key = JSON.stringify(team.users.map(user => user.id).sort());
      teamMap.set(key, team);
    });

    /**
     * Creating Matches
     */
    const createdMatches = await Promise.all(
      matches.map(async (match) => {
        /**
         * Court assingment
         */
        const court = await this.courtManagementService.findAll();
        const selectedCourt = court[0];

        const homeTeam = teamMap.get(JSON.stringify(match.teams[0].userIds.sort()));
        const awayTeam = teamMap.get(JSON.stringify(match.teams[1].userIds.sort()));

        if (!homeTeam || !awayTeam) {
          throw new Error("Team not found for one or both match teams");
        }

        const notStartedMatchStatus = await this.matchStatusService.findMatchStatusByStatusName(MatchStatusTypes.not_started);

        const matchEntity = {
          club,
          tournament,
          courts: [selectedCourt],
          matchDate: match.matchDate,
          tournamentRound: createdTournamentRound,
          homeTeam,
          awayTeam,
          statuses: [notStartedMatchStatus],
        }

        return this.matchService.createMatch(matchEntity as any);
      }),
    );

    /**
     * Creating Matche Rouinds
     */
    let createdMatchRounds = [];
    const notStartedMatchRoundStatus = await this.matchRoundStatusService.findMatchStatusByStatusName(MatchRoundStatusTypes.not_started);
    for (let index = 0; index < createdMatches.length; index++) {
      const match = createdMatches[index];

      for (let index = 1; index <= tournament.bestOfRounds; index++) {
        const createdMatchRound = await this.matchRoundService.createMatchRound({
          club,
          tournament,
          match,
          startTime: match.matchDate,
          endTime: match.matchDate,
          matchRoundNumber: index,
          statuses: [notStartedMatchRoundStatus],
        })

        createdMatchRounds.push(createdMatchRound);
      }
    }

    return {
      schedule: {
        tournament,
        tournamentRound: createdTournamentRound,
        teams: createdTeams,
        matches: createdMatches,
        matchRounds: createdMatchRounds,
      }
    }
  }
}
