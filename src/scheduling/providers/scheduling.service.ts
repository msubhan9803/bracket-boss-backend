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
}
