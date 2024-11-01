import { Inject, Injectable } from '@nestjs/common';
import { FormatStrategy } from '../interface/format-strategy.interface';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { StrategyTypes } from 'src/common/types/global';
import { Match, Team } from '../types/common';

@Injectable()
export class SchedulingService {
  private strategies: { [key: string]: FormatStrategy };

  constructor(
    @Inject(StrategyTypes.FORMAT_STRATEGIES)
    strategies: FormatStrategy[],
  ) {
    this.strategies = strategies.reduce((acc, strategy) => {
      acc[strategy.type] = strategy;
      return acc;
    }, {});
  }

  async generateTeamsBasedOnStrategy(
    tournament: Tournament,
    users: number[],
  ): Promise<{ matches: Match[]; teams: Team[] }> {
    const strategy = this.strategies[tournament.format.name];
    if (!strategy) {
      throw new Error('Invalid strategy type');
    }

    const teams = await strategy.generateTeams(users);

    const matches = await strategy.generateMatches(teams);

    return { matches, teams };
  }
}
