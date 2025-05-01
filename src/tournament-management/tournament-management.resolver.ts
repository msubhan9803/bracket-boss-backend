import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { TournamentManagementService } from './providers/tournament-management.service';
import { Tournament } from './entities/tournament.entity';
import { CreateTournamentInputDto } from './dtos/create-tournament-input.dto';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { UpdateTournamentInput } from './dtos/update-tournament-input.dto';
import { TournamentListResponse } from './dtos/get-all-tournaments-response.dto';
import { SortInput } from 'src/common/dtos/sort-input.dto';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import { SportManagementService } from 'src/sport-management/providers/sport-management.service';
import { FormatManagementService } from 'src/format-management/providers/format-management.service';
import { SportName } from 'src/sport-management/types/sport.enums';

@Resolver(() => Tournament)
export class TournamentManagementResolver {
  constructor(
    private readonly tournamentManagementService: TournamentManagementService,
    private readonly sportManagementService: SportManagementService,
    private readonly formatManagementService: FormatManagementService,
  ) {}

  @Query(() => [Tournament])
  async getAllTournamentsWithoutPagination() {
    try {
      const tournaments = await this.tournamentManagementService.findAll();

      return tournaments;
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
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
      const [tournaments, totalRecords] = await this.tournamentManagementService.findAllWithRelations({
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

  @UseGuards(AuthCheckGuard)
  @Query(() => Tournament)
  async getTournamentById(@Args('tournamentId') tournamentId: number) {
    try {
      const tournaments = await this.tournamentManagementService.findOneWithRelations(tournamentId);

      return tournaments;
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => Tournament)
  async createTournament(@Args('input') createTournamentDto: CreateTournamentInputDto): Promise<Tournament> {
    try {
      return this.tournamentManagementService.createTournament(createTournamentDto);
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => Tournament)
  async updateTournament(@Args('input') updateTournamentInput: UpdateTournamentInput): Promise<Tournament> {
    try {
      const sport = await this.sportManagementService.findSportByName(SportName.pickleball);

      const poolPlayFormat = await this.formatManagementService.findOne(updateTournamentInput.formatId);

      return this.tournamentManagementService.update(updateTournamentInput.id, {
        name: updateTournamentInput.name,
        description: updateTournamentInput.description,
        start_date: updateTournamentInput.start_date,
        end_date: updateTournamentInput.end_date,
        isPrivate: updateTournamentInput.isPrivate,
        sport,
        poolPlayFormat,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
