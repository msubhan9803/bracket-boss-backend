import { FormatType } from 'src/format-management/types/format.enums';
import { Match, Team } from '../types/common';

export interface FormatStrategy {
  type: FormatType;
  generateTeams(users: number[]): Promise<Team[]>;
  generateMatches(teams: Team[]): Promise<Match[]>;
}
