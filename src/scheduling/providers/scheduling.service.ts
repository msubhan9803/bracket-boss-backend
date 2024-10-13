import { Injectable } from '@nestjs/common';
import { BracketStrategy } from '../interface/bracket-strategy.interface';
import { RoundRobinTeamBasedStrategy } from '../strategies/round-robin-team-based.strategy';
import { BracketType } from 'src/bracket-management/types/bracket.enums';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';

@Injectable()
export class SchedulingService {
  private strategies: { [key: string]: BracketStrategy } = {
    [BracketType.round_robin]: new RoundRobinTeamBasedStrategy(),
  };

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
