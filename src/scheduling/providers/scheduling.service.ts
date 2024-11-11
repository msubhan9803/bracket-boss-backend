import { Inject, Injectable } from '@nestjs/common';
import { FormatStrategy } from '../interface/format-strategy.interface';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { StrategyTypes } from 'src/common/types/global';
import { Match as MatchEntity, Team as TeamEntity } from '../types/common';
import { TeamGenerationStrategy } from '../interface/team-generation-strategy.interface';
import { UsersService } from 'src/users/providers/users.service';
import { CreateScheduleInputDto } from '../dtos/create-schedule-input.dto';
import { CreateScheduleResponseDto } from '../dtos/create-schedule-response.dto';
import { TournamentManagementService } from 'src/tournament-management/providers/tournament-management.service';
import { TournamentRoundService } from 'src/tournament-management/providers/tournament-round.service';
import { ClubsService } from 'src/clubs/providers/clubs.service';
import { TeamManagementService } from 'src/team-management/providers/team-management.service';

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
  ): Promise<{ matches: MatchEntity[]; teams: TeamEntity[] }> {
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
    const createdTournamentRound = await this.tournamentRoundService.createTournamentRound(club, tournament);

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

    return {
      schedule: {
        tournament,
      }
    }
  }
}
