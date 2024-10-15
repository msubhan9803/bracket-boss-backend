import { Injectable } from '@nestjs/common';
import { BracketStrategy } from '../interface/bracket-strategy.interface';
import { BracketType } from 'src/bracket-management/types/bracket.enums';
import { Match, Team } from '../types/common';

@Injectable()
export class RoundRobinPlayerBasedStrategy implements BracketStrategy {
  type = BracketType.round_robin_player;

  async generateTeams(users: number[]): Promise<Team[]> {
    console.log(
      '👯 generating teams based on round robin (player-based) strategy',
    );
    console.log('users', users);

    return [];
  }

  async generateMatches(teams: Team[]): Promise<Match[]> {
    console.log(
      '🏁 generating matches based on round robin (player-based) strategy',
    );
    console.log('teams', teams);

    return [];
  }
}
