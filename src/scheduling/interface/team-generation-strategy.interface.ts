/* eslint-disable @typescript-eslint/no-empty-object-type */
import { User } from 'src/users/entities/user.entity';
import { Team } from '../types/common';
import { TeamGenerationTypeEnum } from 'src/team-generation-type-management/types/team-generation-type.enums';

export interface TeamGenerationConfig {}

export interface TeamGenerationStrategy {
  type: TeamGenerationTypeEnum;
  generateTeams(users: User[], config?: TeamGenerationConfig): Promise<Team[]>;
}
