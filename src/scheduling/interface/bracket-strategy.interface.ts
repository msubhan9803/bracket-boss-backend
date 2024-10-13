export interface BracketStrategy {
  generateTeams(tournamentId: number, users: any[]): Promise<void>;

  generateMatches(tournamentId: number, teams: any[]): Promise<void>;
}
