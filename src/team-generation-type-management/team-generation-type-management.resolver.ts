import { Args, Query, Resolver } from '@nestjs/graphql';
import { TeamGenerationType } from './entities/team-generation-type.entity';
import { TeamGenerationTypeManagementService } from './providers/team-generation-type-management.service';
import { InternalServerErrorException } from '@nestjs/common';
import { FormatManagementService } from 'src/format-management/providers/format-management.service';

@Resolver(() => TeamGenerationType)
export class TeamGenerationTypeManagementResolver {
  constructor(
    private readonly formatManagementService: FormatManagementService,
    private readonly teamGenerationTypeManagementService: TeamGenerationTypeManagementService,
  ) {}

  @Query(() => [TeamGenerationType])
  async getAllTeamGenerationTypesByFormatId(
    @Args('formatId') formatId: number,
  ) {
    try {
      const format = await this.formatManagementService.findOne(formatId);

      return await this.teamGenerationTypeManagementService.findAllByFormatId(
        format,
      );
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
