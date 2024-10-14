import { BracketType } from 'src/bracket-management/types/bracket.enums';

export interface BracketStrategy {
  type: BracketType;
  generateTeams(tournamentId: number, users: any[]): Promise<void>;
  generateMatches(tournamentId: number, teams: any[]): Promise<void>;
}
