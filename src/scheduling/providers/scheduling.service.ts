import { Inject, Injectable } from '@nestjs/common';
import { BracketStrategy } from '../interface/bracket-strategy.interface';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { StrategyTypes } from 'src/common/types/global';
import { Match, Team } from '../types/common';

@Injectable()
export class SchedulingService {
  private strategies: { [key: string]: BracketStrategy };

  constructor(
    @Inject(StrategyTypes.BRACKET_STRATEGIES)
    strategies: BracketStrategy[],
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
    const strategy = this.strategies[tournament.bracket.name];
    if (!strategy) {
      throw new Error('Invalid strategy type');
    }

    const teams = await strategy.generateTeams(users);

    const matches = await strategy.generateMatches(teams);

    return { matches, teams };
  }
}
