import { BracketType } from 'src/bracket-management/types/bracket.enums';
import { Match, Team } from '../types/common';

export interface BracketStrategy {
  type: BracketType;
  generateTeams(users: number[]): Promise<Team[]>;
  generateMatches(teams: Team[]): Promise<Match[]>;
}
