import { Injectable } from '@nestjs/common';
import { FormatStrategy } from '../interface/format-strategy.interface';
import { FormatType } from 'src/format-management/types/format.enums';
import { Match, Team } from '../types/common';

@Injectable()
export class RoundRobinStrategy implements FormatStrategy {
  type = FormatType.round_robin;

  async generateMatches(teams: Team[]): Promise<Match[]> {
    const matches: Match[] = [];

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({
          name: `Match ${teams[i].name} vs ${teams[j].name}`,
          teams: [teams[i], teams[j]],
        });
      }
    }

    return matches;
  }
}
