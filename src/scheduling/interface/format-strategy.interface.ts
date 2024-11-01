import { FormatType } from 'src/format-management/types/format.enums';
import { Match, Team } from '../types/common';

export interface FormatStrategy {
  type: FormatType;
  generateMatches(teams: Team[]): Promise<Match[]>;
}
