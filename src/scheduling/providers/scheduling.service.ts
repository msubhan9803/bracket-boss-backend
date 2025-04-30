import { Inject, Injectable } from '@nestjs/common';
import { FormatStrategy } from '../interface/format-strategy.interface';
import { StrategyTypes } from 'src/common/types/global';
import { TournamentManagementService } from 'src/tournament-management/providers/tournament-management.service';
import { TeamManagementService } from 'src/team-management/providers/team-management.service';
import { MatchService } from 'src/match-management/providers/match.service';
import { MatchCourtScheduleService } from 'src/match-management/providers/matct-court-schedule.service';
import { LevelService } from 'src/level/providers/level.service';
import { PoolService } from 'src/pool/providers/pool.service';
import { LevelTypeEnum, LevelTypeOrderNumber } from 'src/level/types/common';
import { Pool } from 'src/pool/entities/pool.entity';
import { Level } from 'src/level/entities/level.entity';
import { TeamGenerationStrategy } from '../interface/team-generation-strategy.interface';
import { CreateTournamentTeamsInputDto } from 'src/team-management/dtos/create-tournament-teams-input.dto';
import { Team } from 'src/team-management/entities/team.entity';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class SchedulingService {
  private formatStrategies: { [key: string]: FormatStrategy };
  private teamGenerationStrategies: { [key: string]: TeamGenerationStrategy };

  constructor(
    @Inject(StrategyTypes.FORMAT_STRATEGIES)
    formatStrategies: FormatStrategy[],
    @Inject(StrategyTypes.TEAM_GENERATION_STRATEGIES)
    teamGenerationStrategies: TeamGenerationStrategy[],
    private readonly tournamentManagementService: TournamentManagementService,
    private readonly teamManagementService: TeamManagementService,
    private readonly matchService: MatchService,
    private readonly matchCourtScheduleService: MatchCourtScheduleService,
    private readonly levelService: LevelService,
    private readonly poolService: PoolService,
    private readonly usersService: UsersService,
  ) {
    this.formatStrategies = formatStrategies.reduce((acc, strategy) => {
      acc[strategy.type] = strategy;
      return acc;
    }, {});
    this.teamGenerationStrategies = teamGenerationStrategies.reduce((acc, strategy) => {
      acc[strategy.type] = strategy;
      return acc;
    }, {});
  }

  async createSchedule(tournamentId: number): Promise<Level> {
    const tournament = await this.tournamentManagementService.findOneWithRelations(tournamentId);
    const { numberOfPools } = tournament;
    const formatStrategy = this.formatStrategies[tournament.poolPlayFormat.name];
    let pools: Pool[] = [];

    /**
     * Group Teams into Pools
     */
    const teams = await this.teamManagementService.findTeamsByTournament(tournament.id, ['users']);
    const teamsByPool: any[][] = Array.from({ length: numberOfPools }, () => []);
    teams.forEach((team, index) => {
      teamsByPool[index % numberOfPools].push(team);
    });

    /**
     * Creating Level
     */
    const level = await this.levelService.createLevel({
      type: LevelTypeEnum.pool_play,
      name: 'Pool Play',
      order: LevelTypeOrderNumber.pool_play,
      format: tournament.poolPlayFormat,
      tournament,
    });

    /**
     * Creating Pools
     * Getting Rounds & their Matches list
     */
    for (let poolNumber = 0; poolNumber < numberOfPools; poolNumber++) {
      const pool = await this.poolService.createPool({
        name: `Pool ${poolNumber + 1}`,
        tournament,
        level,
        order: poolNumber + 1,
      });

      const roundsWithMatches = await formatStrategy.createInitialRounds(tournament, pool, teamsByPool[poolNumber]);

      pools.push({
        ...pool,
        rounds: roundsWithMatches,
      });
    }

    return {
      ...level,
      pools,
    };
  }

  async getScheduleOfTournament(tournamentId: number): Promise<Level[]> {
    const tournament = await this.tournamentManagementService.findOne(tournamentId);
    const levels = await this.levelService.findOneWithRelations(tournament, [
      'format',
      'tournament',
      'pools',
      'pools.rounds',
      'pools.rounds.matches',
      'pools.rounds.matches.homeTeam',
      'pools.rounds.matches.awayTeam',
      'pools.rounds.matches.winnerTeam',
      'pools.rounds.matches.matchRounds',
    ]);

    return levels;
  }

  async deleteScheduleOfTournament(tournamentId: number) {
    const tournament = await this.tournamentManagementService.findOne(tournamentId);
    const matches = await this.matchService.findMatchesByTournament(tournament);

    for (const match of matches) {
      await this.matchCourtScheduleService.deleteMatchCourtSchedules(match);
      await this.matchService.deleteMatch(match);
    }

    await this.teamManagementService.deleteTeamsByTournament(tournament);
  }

  async createTournamentTeams(createTournamentTeamsInputDto: CreateTournamentTeamsInputDto): Promise<Team[]> {
    const { tournamentId, users } = createTournamentTeamsInputDto;

    const tournament = await this.tournamentManagementService.findOneWithRelations(tournamentId);
    if (!tournament) {
      throw new Error(`Tournament with ID ${tournamentId} not found`);
    }

    const uniqueUserIds = [...new Set(users)];
    const userRecords = await this.usersService.findMultipleUsersById(uniqueUserIds);
    const teams = await this.teamGenerationStrategies[tournament.teamGenerationType.name].generateTeams(userRecords);

    if (userRecords.length !== uniqueUserIds.length) {
      const foundUserIds = userRecords.map((user) => user.id);
      const missingUserIds = uniqueUserIds.filter((id) => !foundUserIds.includes(id));
      throw new Error(`Users with IDs ${missingUserIds.join(', ')} not found`);
    }

    return await this.teamManagementService.createTeamOfTournament(tournament, teams, userRecords);
  }
}
