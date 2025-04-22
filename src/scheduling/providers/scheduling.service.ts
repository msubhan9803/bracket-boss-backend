import { Inject, Injectable } from '@nestjs/common';
import { FormatStrategy } from '../interface/format-strategy.interface';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { StrategyTypes } from 'src/common/types/global';
import { Match as MatchEntity, MatchTeam } from '../types/common';
import { TeamGenerationStrategy } from '../interface/team-generation-strategy.interface';
import { UsersService } from 'src/users/providers/users.service';
import { CreateScheduleInputDto } from '../dtos/create-schedule-input.dto';
import { CreateScheduleResponseDto } from '../dtos/create-schedule-response.dto';
import { TournamentManagementService } from 'src/tournament-management/providers/tournament-management.service';
import { ClubsService } from 'src/clubs/providers/clubs.service';
import { TeamManagementService } from 'src/team-management/providers/team-management.service';
import { MatchService } from 'src/match-management/providers/match.service';
import { MatchRoundService } from 'src/match-management/providers/match-round.service';
import { ScheduleDto } from '../dtos/schedule.dto';
import { MatchGroupingService } from './match-grouping.service';
import { CreateScheduleHelperService } from './create-schedule-helper.service';
import { MatctCourtScheduleService } from 'src/match-management/providers/matct-court-schedule.service';

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
    private readonly clubsService: ClubsService,
    private readonly teamManagementService: TeamManagementService,
    private readonly matchService: MatchService,
    private readonly matchRoundService: MatchRoundService,
    private readonly createScheduleHelperService: CreateScheduleHelperService,
    private readonly matchGroupingService: MatchGroupingService,
    private readonly matctCourtScheduleService: MatctCourtScheduleService,
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
  ): Promise<{ matches: MatchEntity[]; teams: MatchTeam[] }> {
    const { formatStrategy, teamGenerationStrategy } = this.getStrategy(
      tournament.poolPlayFormat.name,
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
     * Create Teams
     */
    const teams = matches.map((match) => match.teams).flat();
    const teamMap = await this.createScheduleHelperService.createTeams(teams, tournamentId, clubId);

    /**
     * Fetching available courts for the tournament duration
     */
    const timeSlotWithCourts = await this.createScheduleHelperService.getAvailableCourts(tournament.start_date, tournament.end_date);

    /**
     * Grouping matches by uniqueness
     */
    const groupedMatches = this.matchGroupingService.groupMatchesByUniqueness(matches);

    /**
     * Creating Matches
     */
    const createdMatches = await this.createScheduleHelperService.createMatches(
      groupedMatches,
      teamMap,
      club,
      tournament,
      timeSlotWithCourts,
    );

    /**
     * Creating Match Rounds
     */
    const createdMatchRounds = await this.createScheduleHelperService.createMatchRounds(
      createdMatches,
      tournament,
      club,
      tournament.matchBestOfRounds,
    );

    return {
      schedule: {
        tournament,
        teams: Array.from(teamMap.values()),
        matches: createdMatches,
        matchRounds: createdMatchRounds,
      },
    };
  }

  async getScheduleOfTournament(tournamentId: number): Promise<ScheduleDto> {
    const tournament = await this.tournamentManagementService.findOne(tournamentId);
    const teams = await this.teamManagementService.findTeamsByTournament(tournament)
    const matches = await this.matchService.findMatchesByTournament(tournament)
    const matchRounds = await this.matchRoundService.findMatchRoundsByTournament(tournament);
    const matchesWithCourtSchedule = await this.matctCourtScheduleService.populateMatchesCourtsInMatches(matches);

    return {
      tournament,
      teams,
      matches: matchesWithCourtSchedule,
      matchRounds,
    }
  }

  async deleteScheduleOfTournament(tournamentId: number) {
    const tournament = await this.tournamentManagementService.findOne(tournamentId);
    const matches = await this.matchService.findMatchesByTournament(tournament);

    for (const match of matches) {
      await this.matctCourtScheduleService.deleteMatchCourtSchedules(match);
    }

    await this.teamManagementService.deleteTeamsByTournament(tournament);
  }
}
