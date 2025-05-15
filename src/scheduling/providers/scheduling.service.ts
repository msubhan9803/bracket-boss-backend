import { Inject, Injectable } from '@nestjs/common';
import { FormatStrategy } from '../interface/format-strategy.interface';
import { StrategyTypes } from 'src/common/types/global';
import { TournamentManagementService } from 'src/tournament-management/providers/tournament-management.service';
import { TeamManagementService } from 'src/team-management/providers/team-management.service';
import { MatchService } from 'src/match-management/providers/match.service';
import { MatchCourtScheduleService } from 'src/match-management/providers/match-court-schedule.service';
import { LevelService } from 'src/level/providers/level.service';
import { PoolService } from 'src/pool/providers/pool.service';
import { Pool } from 'src/pool/entities/pool.entity';
import { Level } from 'src/level/entities/level.entity';
import { TeamGenerationStrategy } from '../interface/team-generation-strategy.interface';
import { CreateTournamentTeamsInputDto } from 'src/team-management/dtos/create-tournament-teams-input.dto';
import { Team } from 'src/team-management/entities/team.entity';
import { UsersService } from 'src/users/providers/users.service';
import { LevelStatusTypesEnum } from 'src/level/types/common';
import { RoundStatusTypesEnum } from 'src/round/types/common';
import { LevelTeamStandingService } from 'src/level/providers/level-team-standing.service';
import { TournamentStatusTypesEnum } from 'src/tournament-management/types/common';
import { DataSource } from 'typeorm';

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
    private readonly levelTeamStandingService: LevelTeamStandingService,
    private readonly dataSource: DataSource,
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

  async createSchedule(tournamentId: number): Promise<Level[]> {
    const tournament = await this.tournamentManagementService.findOneWithRelations(tournamentId);
    const { numberOfPools } = tournament;
    const pools: Pool[] = [];

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
    const levels = await this.levelService.findAllByTournamentWithRelations(tournament);
    const selectedLevel = levels[0];

    await this.levelService.updateLevel(selectedLevel.id, { status: LevelStatusTypesEnum.in_progress });

    /**
     * Selecting Strategy
     */
    const formatStrategy = this.formatStrategies[selectedLevel.format.name];

    /**
     * Creating Pools
     * Getting Rounds & their Matches list
     */
    for (let poolNumber = 0; poolNumber < numberOfPools; poolNumber++) {
      const pool = await this.poolService.createPool({
        name: `Pool ${poolNumber + 1}`,
        tournament,
        level: selectedLevel,
        order: poolNumber + 1,
      });

      const roundsWithMatches = await formatStrategy.createInitialRounds(tournament, selectedLevel, pool, teamsByPool[poolNumber]);

      pools.push({
        ...pool,
        rounds: roundsWithMatches,
      });
    }
    selectedLevel.pools = pools;

    return [
      selectedLevel
    ]
  }

  async proceedToNextLevel(tournamentId: number): Promise<Level[]> {
    const tournament = await this.tournamentManagementService.findOne(tournamentId);
    if (!tournament) {
      throw new Error('Tournament not found');
    }

    const levels = await this.levelService.findAllByTournamentWithRelations(
      tournament,
      ['format', 'pools', 'pools.rounds', 'levelTeamStandings', 'levelTeamStandings.team']
    );

    const currentLevel = levels.find(level => level.status === LevelStatusTypesEnum.in_progress);
    if (!currentLevel) {
      throw new Error('No level is currently in progress');
    }

    for (const pool of currentLevel.pools) {
      const incompleteRounds = pool.rounds.filter(round => round.status !== RoundStatusTypesEnum.completed);
      if (incompleteRounds.length > 0) {
        throw new Error(`Pool ${pool.name} has incomplete rounds. Please complete all rounds before proceeding.`);
      }
    }

    const nextLevel = levels.find(level => level.order === currentLevel.order + 1);
    if (!nextLevel) {
      throw new Error('No next level found');
    }

    /**
     * Need to Select teams from previous Level's Standings
     */
    const levelTeamStandingsOfCurrentLevel = await this.levelTeamStandingService.findAllByLevelId({
      levelId: currentLevel.id,
      order: { wins: 'DESC' }
    });

    /**
     * Get the Strategy
     */
    const formatStrategy = this.formatStrategies[nextLevel.format.name];

    /**
     * Select Teams
     */
    const teams = await formatStrategy.selectTeams(levelTeamStandingsOfCurrentLevel);

    /**
     * Create Pool
     */
    const pool = await this.poolService.createPool({
      name: 'Pool 1',
      tournament,
      level: nextLevel,
      order: 1,
    });

    /**
     * Create Rounds, Matches, Match Court Schedules & Match Rounds
     */
    const roundsWithMatches = await formatStrategy.createInitialRounds(tournament, nextLevel, pool, teams);

    nextLevel.pools = [
      {
        ...pool,
        rounds: roundsWithMatches,
      }
    ];

    /**
     * Updating Level Status
     */
    await this.levelService.updateLevel(currentLevel.id, { status: LevelStatusTypesEnum.completed });
    await this.levelService.updateLevel(nextLevel.id, { status: LevelStatusTypesEnum.in_progress });


    /**
     * Updating Tournament Status
     */
    await this.tournamentManagementService.update(tournamentId, { status: TournamentStatusTypesEnum.play_off_in_progress })

    return [
      nextLevel
    ]
  }

  async endRound(levelId: number, poolId: number) {
    const level = await this.levelService.findOne(levelId);
    const formatStrategy = this.formatStrategies[level.format.name];
    await formatStrategy.handleEndRound(poolId)
  }

  async concludeTournament(tournamentId: number) {
    const tournament = await this.tournamentManagementService.findOneWithRelations(tournamentId);
    const lastLevel = tournament.levels.pop();

    const formatStrategy = this.formatStrategies[lastLevel.format.name];
    await formatStrategy.concludeTournament(tournament)

    await this.tournamentManagementService.update(tournamentId, { status: TournamentStatusTypesEnum.completed })
  }

  async getScheduleOfTournament(tournamentId: number): Promise<Level[]> {
    const tournament = await this.tournamentManagementService.findOne(tournamentId);
    const levels = await this.levelService.findAllByTournamentWithRelations(tournament, [
      'format',
      'tournament',
      'pools',
      'pools.rounds',
      'pools.rounds.matches',
      'pools.rounds.matches.homeTeam',
      'pools.rounds.matches.awayTeam',
      'pools.rounds.matches.winnerTeam',
      'pools.rounds.matches.matchRounds',
      'pools.rounds.matches.matchCourtSchedule',
      'pools.rounds.matches.matchCourtSchedule.courtSchedule',
      'pools.rounds.matches.matchCourtSchedule.courtSchedule.day',
      'pools.rounds.matches.matchCourtSchedule.courtSchedule.timeSlot',
      'pools.rounds.matches.matchCourtSchedule.courtSchedule.court',
      'pools.rounds.matches.matchCourtSchedule.courtSchedule.court.club',
    ]);

    return levels;
  }

  async deleteScheduleOfTournament(tournamentId: number) {
    const tournament = await this.tournamentManagementService.findOne(tournamentId);
    if (!tournament) {
      throw new Error(`Tournament with ID ${tournamentId} not found`);
    }
  
    try {
      // Start a transaction
      await this.dataSource.transaction(async (manager) => {
        // Delete tournament results and winners
        await manager.query('DELETE FROM tournament_winner WHERE "tournamentId" = $1', [tournamentId]);
        await manager.query('DELETE FROM tournament_result WHERE "tournamentId" = $1', [tournamentId]);
        
        // Delete match related records
        await manager.query('DELETE FROM match_court_schedules WHERE "matchId" IN (SELECT id FROM match WHERE "tournamentId" = $1)', [tournamentId]);
        await manager.query('DELETE FROM match_round_score WHERE "matchRoundId" IN (SELECT id FROM match_round WHERE "matchId" IN (SELECT id FROM match WHERE "tournamentId" = $1))', [tournamentId]);
        await manager.query('DELETE FROM match_round WHERE "matchId" IN (SELECT id FROM match WHERE "tournamentId" = $1)', [tournamentId]);
        await manager.query('DELETE FROM match WHERE "tournamentId" = $1', [tournamentId]);
        
        // Delete team related records
        await manager.query('DELETE FROM level_team_standing WHERE "levelId" IN (SELECT id FROM level WHERE "tournamentId" = $1)', [tournamentId]);
        await manager.query('DELETE FROM team WHERE "tournamentId" = $1', [tournamentId]);
        
        // Delete level related records
        await manager.query('DELETE FROM round WHERE "poolId" IN (SELECT id FROM pool WHERE "levelId" IN (SELECT id FROM level WHERE "tournamentId" = $1))', [tournamentId]);
        await manager.query('DELETE FROM pool WHERE "levelId" IN (SELECT id FROM level WHERE "tournamentId" = $1)', [tournamentId]);
        await manager.query('UPDATE level SET status = $1 WHERE "tournamentId" = $2', [LevelStatusTypesEnum.not_started, tournamentId]);
      });
  
      await this.tournamentManagementService.update(tournamentId, { status: TournamentStatusTypesEnum.not_started });
    } catch (error) {
      throw new Error(`Failed to delete tournament schedule: ${error.message}`);
    }
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
