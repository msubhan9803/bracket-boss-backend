import { Team } from '../types/common';
import { TeamGenerationTypeEnum } from 'src/team-generation-type-management/types/team-generation-type.enums';

export interface TeamGenerationStrategy {
  type: TeamGenerationTypeEnum;
  generateTeams(users: number[]): Promise<Team[]>;
}
