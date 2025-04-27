import { Inject, Injectable } from '@nestjs/common';
import { FormatStrategy } from '../interface/format-strategy.interface';
import { StrategyTypes } from 'src/common/types/global';
import { TeamGenerationStrategy } from '../interface/team-generation-strategy.interface';
import { CreateScheduleResponseDto } from '../dtos/create-schedule-response.dto';
import { TournamentManagementService } from 'src/tournament-management/providers/tournament-management.service';
import { TeamManagementService } from 'src/team-management/providers/team-management.service';
import { MatchService } from 'src/match-management/providers/match.service';
import { ScheduleDto } from '../dtos/schedule.dto';
import { MatchCourtScheduleService } from 'src/match-management/providers/matct-court-schedule.service';
import { LevelService } from 'src/level/providers/level.service';
import { PoolService } from 'src/pool/providers/pool.service';
import { LevelTypeEnum, LevelTypeOrderNumber } from 'src/level/types/common';
import { Pool } from 'src/pool/entities/pool.entity';

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

  async createSchedule(
    tournamentId: number,
  ): Promise<CreateScheduleResponseDto> {
    const tournament = await this.tournamentManagementService.findOneWithRelations(tournamentId);
    const { numberOfPools } = tournament;
    const formatStrategy = this.formatStrategies[tournament.poolPlayFormat.name];
    let pools: Pool[] = [];

    /**
     * Group Teams into Pools
     */
    const teams = await this.teamManagementService.findTeamsByTournament(
      tournament,
      ['users'],
    );
    const teamsByPool: any[][] = Array.from(
      { length: numberOfPools },
      () => [],
    );
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
      });

      const roundsWithMatches = await formatStrategy.createInitialRounds(
        tournament,
        pool,
        teamsByPool[poolNumber],
      );

      pools.push({
        ...pool,
        rounds: roundsWithMatches,
      });
    }

    return null as any;
  }

  async getScheduleOfTournament(tournamentId: number): Promise<ScheduleDto> {
    const tournament =
      await this.tournamentManagementService.findOne(tournamentId);
    const teams =
      await this.teamManagementService.findTeamsByTournament(tournament);
    const matches = await this.matchService.findMatchesByTournament(tournament);
    const matchesWithCourtSchedule =
      await this.matchCourtScheduleService.populateMatchesCourtsInMatches(
        matches,
      );

    return {
      tournament,
      teams,
      matches: matchesWithCourtSchedule,
    };
  }

  async deleteScheduleOfTournament(tournamentId: number) {
    const tournament =
      await this.tournamentManagementService.findOne(tournamentId);
    const matches = await this.matchService.findMatchesByTournament(tournament);

    for (const match of matches) {
      await this.matchCourtScheduleService.deleteMatchCourtSchedules(match);
      await this.matchService.deleteMatch(match);
    }

    await this.teamManagementService.deleteTeamsByTournament(tournament);
  }
}
