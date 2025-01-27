import { Injectable } from '@nestjs/common';
import { MatchTeam } from '../types/common';
import { TeamGenerationTypeEnum } from 'src/team-generation-type-management/types/team-generation-type.enums';
import { TeamGenerationStrategy } from '../interface/team-generation-strategy.interface';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BlindDrawTeamGenerationStrategy implements TeamGenerationStrategy {
  type = TeamGenerationTypeEnum.blind_draw;

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
  async generateTeams(users: User[]): Promise<MatchTeam[]> {
    const teams: MatchTeam[] = [];
    const teamSize = 2;

    for (let i = 0; i < users.length; i += teamSize) {
      teams.push({
        name: `Team ${Math.floor(i / teamSize) + 1}`,
        players: users.slice(i, i + teamSize).map((userId) => userId),
      });
    }

    return teams;
  }
}
