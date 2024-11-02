import { Injectable } from '@nestjs/common';
import { GroupByEnum, Team } from '../types/common';
import { TeamGenerationTypeEnum } from 'src/team-generation-type-management/types/team-generation-type.enums';
import {
  TeamGenerationConfig,
  TeamGenerationStrategy,
} from '../interface/team-generation-strategy.interface';

export interface SplitSwitchTeamGenerationConfig extends TeamGenerationConfig {
  groupBy: GroupByEnum;
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
   * @param users number[]
   * @param config SplitSwitchTeamGenerationConfig
   * @returns Team[]
   */
  async generateTeams(
    users: any[],
    config: SplitSwitchTeamGenerationConfig,
  ): Promise<Team[]> {
    // const temp = config.groupBy === GroupByEnum.GENDER;

    const teams: Team[] = [];
    const group1: any[] = [];
    const group2: any[] = [];

    // Split users into two groups based on the groupBy criteria
    users.forEach((user, index) => {
      if (index % 2 === 0) {
        group1.push(user);
      } else {
        group2.push(user);
      }
    });

    // Ensure both groups have the same number of players
    const minGroupSize = Math.min(group1.length, group2.length);
    group1.length = minGroupSize;
    group2.length = minGroupSize;

    // Pair players from Group 1 with players from Group 2
    for (let i = 0; i < minGroupSize; i++) {
      teams.push({
        name: `Team ${i + 1}`,
        players: [group1[i], group2[i]],
      });
    }

    return teams;
  }
}
