import { Injectable } from '@nestjs/common';
import { BracketStrategy } from '../interface/bracket-strategy.interface';
import { BracketType } from 'src/bracket-management/types/bracket.enums';

@Injectable()
export class RoundRobinTeamBasedStrategy implements BracketStrategy {
  type = BracketType.round_robin;

  async generateTeams(tournamentId: number, users: any[]): Promise<void> {
    console.log(
      '👯 generating teams based on round robin (team-based) strategy',
    );
    console.log('tournamentId', tournamentId);
    console.log('users', users);
  }

  async generateMatches(tournamentId: number, teams: any[]): Promise<void> {
    console.log(
      '🏁 generating matches based on round robin (team-based) strategy',
    );
    console.log('tournamentId', tournamentId);
    console.log('teams', teams);
  }
}
