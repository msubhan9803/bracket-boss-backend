import { FormatType } from 'src/format-management/types/format.enums';
import { Match, MatchTeam } from '../types/common';

export interface FormatStrategy {
  type: FormatType;
  generateMatches(teams: MatchTeam[]): Promise<Match[]>;
}
