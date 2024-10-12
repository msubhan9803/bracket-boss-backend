import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { TournamentManagementService } from './providers/tournament-management.service';
import { Tournament } from './entities/tournament.entity';
import { CreateTournamentInputDto } from './dtos/create-tournament-input.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { UpdateTournamentInput } from './dtos/update-tournament-input.dto';
import { TournamentListResponse } from './dtos/get-all-tournaments-response.dto';
import { SortInput } from './dtos/sort-input.dto';

@Resolver(() => Tournament)
export class TournamentManagementResolver {
  constructor(
    private readonly tournamentManagementService: TournamentManagementService,
  ) {}

  @Query(() => TournamentListResponse)
  async getAllTournaments(
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
      const [tournaments, totalRecords] =
        await this.tournamentManagementService.findAllWithRelations({
          page,
          pageSize,
          filterBy,
          filter,
          sort,
        });

      return { tournaments, totalRecords };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @Query(() => Tournament)
  async getTournamentById(@Args('tournamentId') tournamentId: number) {
    try {
      const tournaments =
        await this.tournamentManagementService.findOneWithRelations(
          tournamentId,
        );

      return tournaments;
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @Mutation(() => Tournament)
  async createTournament(
    @Args('input') createTournamentDto: CreateTournamentInputDto,
  ): Promise<Tournament> {
    try {
      return this.tournamentManagementService.createTournament(
        createTournamentDto,
      );
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @Mutation(() => Tournament)
  async updateTournament(
    @Args('input') updateTournamentInput: UpdateTournamentInput,
  ): Promise<Tournament> {
    try {
      return this.tournamentManagementService.update(
        updateTournamentInput.id,
        updateTournamentInput,
      );
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
