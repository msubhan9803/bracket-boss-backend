import { Injectable } from '@nestjs/common';
import { BracketStrategy } from '../interface/bracket-strategy.interface';
import { BracketType } from 'src/bracket-management/types/bracket.enums';

@Injectable()
export class RoundRobinPlayerBasedStrategy implements BracketStrategy {
  type = BracketType.round_robin_player;

  async generateTeams(tournamentId: number, users: any[]): Promise<void> {
    console.log(
      '👯 generating teams based on round robin (player-based) strategy',
    );
    console.log('tournamentId', tournamentId);
    console.log('users', users);
  }

  async generateMatches(tournamentId: number, teams: any[]): Promise<void> {
    console.log(
      '🏁 generating matches based on round robin (player-based) strategy',
    );
    console.log('tournamentId', tournamentId);
    console.log('teams', teams);
  }
}
