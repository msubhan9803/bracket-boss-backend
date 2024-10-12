import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { Team } from './entities/team.entity';
import { CreateTeamInputDto } from './dtos/create-team-input.dto';
import { TeamManagementService } from './providers/team-management.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import { TeamListResponse } from './dtos/get-all-teams-response.dto';
import { SortInput } from 'src/common/dtos/sort-input.dto';

@Resolver(() => Team)
export class TeamManagementResolver {
  constructor(private readonly teamManagementService: TeamManagementService) {}

  @UseGuards(AuthCheckGuard)
  @Query(() => TeamListResponse)
  async getAllTeams(
    @Args('page', { type: () => Int, nullable: true }) page = 1,
    @Args('pageSize', { type: () => Int, nullable: true }) pageSize = 10,
    @Args('filterBy', { type: () => String, nullable: true }) filterBy?: string,
    @Args('filter', { type: () => String, nullable: true }) filter?: string,
    @Args('sort', { type: () => SortInput, nullable: true })
    sort?: {
      field: string;
      direction: 'ASC' | 'DESC';
    },
  ) {
    try {
      const [teams, totalRecords] =
        await this.teamManagementService.findAllWithRelations({
          page,
          pageSize,
          filterBy,
          filter,
          sort,
        });

      return { teams, totalRecords };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @Mutation(() => Team)
  async createTeam(
    @Args('createTeamInput') createTeamInput: CreateTeamInputDto,
  ): Promise<Team> {
    return this.teamManagementService.createTeam(createTeamInput);
  }
}
