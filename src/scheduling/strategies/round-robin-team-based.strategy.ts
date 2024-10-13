import { BracketStrategy } from '../interface/bracket-strategy.interface';

export class RoundRobinTeamBasedStrategy implements BracketStrategy {
  async generateTeams(tournamentId: number, users: any[]): Promise<void> {
    console.log(
      '👯 generating teams based on round robin (team based) strategy',
    );

    console.log('tournamentId', tournamentId);
    console.log('users', users);
  }

  async generateMatches(tournamentId: number, teams: any[]): Promise<void> {
    console.log(
      '🏁 generating matches based on round robin (team based) strategy',
    );

    console.log('tournamentId', tournamentId);
    console.log('users', teams);
  }
}
