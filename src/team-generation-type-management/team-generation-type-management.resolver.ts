import { Query, Resolver } from '@nestjs/graphql';
import { TeamGenerationType } from './entities/team-generation-type.entity';
import { TeamGenerationTypeManagementService } from './providers/team-generation-type-management.service';
import { InternalServerErrorException } from '@nestjs/common';

@Resolver(() => TeamGenerationType)
export class TeamGenerationTypeManagementResolver {
  constructor(
    private readonly teamGenerationTypeManagementService: TeamGenerationTypeManagementService,
  ) {}

  @Query(() => [TeamGenerationType])
  async getAllTeamGenerationTypes() {
    try {
      return await this.teamGenerationTypeManagementService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
