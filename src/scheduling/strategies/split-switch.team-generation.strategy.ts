import { Injectable } from '@nestjs/common';
import { SplitSwitchGroupByEnum, DraftTeam } from '../types/common';
import { TeamGenerationTypeEnum } from 'src/team-generation-type-management/types/team-generation-type.enums';
import {
  TeamGenerationConfig,
  TeamGenerationStrategy,
} from '../interface/team-generation-strategy.interface';
import { User } from 'src/users/entities/user.entity';

export interface SplitSwitchTeamGenerationConfig extends TeamGenerationConfig {
  groupBy: SplitSwitchGroupByEnum;
}

@Injectable()
export class SplitSwitchTeamGenerationStrategy
  implements TeamGenerationStrategy
{
  type = TeamGenerationTypeEnum.split_switch;

  /**
   * This function generates teams based on the split-switch strategy.
   * It splits the users into two groups and pairs players from Group 1 with players from Group 2.
   *
   * @param users User[]
   * @param config SplitSwitchTeamGenerationConfig
   * @returns Team[]
   */
  async generateTeams(
    users: User[],
    config?: SplitSwitchTeamGenerationConfig,
  ): Promise<DraftTeam[]> {
    const teams: DraftTeam[] = [];
    const group1: User[] = [];
    const group2: User[] = [];

    if (config?.groupBy === SplitSwitchGroupByEnum.gender) {
      users.forEach((user) => {
        if (user.gender === 'male') {
          group1.push(user);
        } else if (user.gender === 'female') {
          group2.push(user);
        }
      });
    } else {
      users.forEach((user, index) => {
        if (index % 2 === 0) {
          group1.push(user);
        } else {
          group2.push(user);
        }
      });
    }

    const minGroupSize = Math.min(group1.length, group2.length);
    group1.length = minGroupSize;
    group2.length = minGroupSize;

    for (let i = 0; i < minGroupSize; i++) {
      teams.push({
        name: `Team ${i + 1}`,
        players: [group1[i], group2[i]],
      });
    }

    return teams;
  }
}
