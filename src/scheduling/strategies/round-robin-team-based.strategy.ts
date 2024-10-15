import { Injectable } from '@nestjs/common';
import { BracketStrategy } from '../interface/bracket-strategy.interface';
import { BracketType } from 'src/bracket-management/types/bracket.enums';
import { Match, Team } from '../types/common';

@Injectable()
export class RoundRobinTeamBasedStrategy implements BracketStrategy {
  type = BracketType.round_robin;

  /**
   * This function generates teams based on the round-robin strategy.
   * It takes and creates teams of equal size based on the number of users.
   * The number of users is 2 per team
   *
   * 🌺 Following logic works for even no. of users.
   * 🌺 So what'll happen if there's 9 players?
   *
   * @param users number[]
   * @returns Team[]
   */
  async generateTeams(users: any[]): Promise<Team[]> {
    const teams: Team[] = [];
    const teamSize = 2;

    for (let i = 0; i < users.length; i += teamSize) {
      teams.push({
        name: `Team ${Math.floor(i / teamSize) + 1}`,
        players: users.slice(i, i + teamSize).map((userId) => userId),
      });
    }

    return teams;
  }

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
