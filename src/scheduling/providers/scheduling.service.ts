import { Inject, Injectable } from '@nestjs/common';
import { FormatStrategy } from '../interface/format-strategy.interface';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { StrategyTypes } from 'src/common/types/global';
import { Match, Team } from '../types/common';
import { TeamGenerationStrategy } from '../interface/team-generation-strategy.interface';
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
    private usersService: UsersService,
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
  ): Promise<{ matches: Match[]; teams: Team[] }> {
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

  async createSchedule(
    tournament: Tournament,
    matches: {
      name: string;
      teams: {
        name: string;
        players: { name: string }[];
      }[];
    }[],
    matchDate: Date,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Extract unique teams
      const uniqueTeamsMap = new Map<string, Team>();

      for (const match of matches) {
        for (const team of match.teams) {
          if (!uniqueTeamsMap.has(team.name)) {
            const newTeam = new Team({
              name: team.name,
              players: team.players.map((player) => ({ name: player.name })),
            });
            uniqueTeamsMap.set(team.name, newTeam);
          }
        }
      }

      // Save unique teams to the database
      const uniqueTeams = Array.from(uniqueTeamsMap.values());
      await queryRunner.manager.save(uniqueTeams);

      // Create Tournament Round
      const tournamentRound = new TournamentRound({
        roundNumber: 1,
        roundType: tournament.format,
        tournament,
        statuses: [
          new TournamentRoundStatus({
            status: 'not_started',
          }),
        ],
      });
      await queryRunner.manager.save(tournamentRound);

      // Create Matches
      for (const match of matches) {
        const homeTeam = uniqueTeamsMap.get(match.teams[0].name);
        const awayTeam = uniqueTeamsMap.get(match.teams[1].name);

        const newMatch = new Match({
          match_date: matchDate,
          tournamentRound,
          homeTeam,
          awayTeam,
          statuses: [
            new MatchStatus({
              status: 'not_started',
            }),
          ],
        });
        await queryRunner.manager.save(newMatch);

        // Create Match Rounds
        for (let i = 1; i <= tournament.bestOfRounds; i++) {
          const matchRound = new MatchRound({
            match: newMatch,
            matchRoundNumber: i,
            startTime: matchDate,
            endTime: matchDate,
            statuses: [
              new MatchRoundStatus({
                status: 'not_started',
              }),
            ],
          });
          await queryRunner.manager.save(matchRound);
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
