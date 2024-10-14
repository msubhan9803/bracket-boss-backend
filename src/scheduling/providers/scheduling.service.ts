import { Inject, Injectable } from '@nestjs/common';
import { BracketStrategy } from '../interface/bracket-strategy.interface';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { StrategyTypes } from 'src/common/types/global';

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
    users: any[],
  ): Promise<void> {
    const strategy = this.strategies[tournament.bracket.name];
    if (!strategy) {
      throw new Error('Invalid strategy type');
    }

    await strategy.generateTeams(tournament.id, users);
  }

  async generateMatchesBasedOnStrategy(
    tournament: Tournament,
    teams: any[],
  ): Promise<void> {
    const strategy = this.strategies[tournament.bracket.name];
    if (!strategy) {
      throw new Error('Invalid strategy type');
    }

    await strategy.generateMatches(tournament.id, teams);
  }
}
