import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CourtManagementService } from './providers/court-management.service';
import { Court } from './entities/court.entity';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { CourtListResponse } from './dtos/get-all-courts-response.dto';
import { SortInput } from 'src/common/dtos/sort-input.dto';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import { UpsertCourtInputDto } from './dtos/upsert-court-input.dto';

@Resolver()
export class CourtManagementResolver {
  constructor(
    private readonly courtManagementService: CourtManagementService,
  ) { }

  @UseGuards(AuthCheckGuard)
  @Query(() => CourtListResponse)
  async getAllCourts(
    @Args('page', { type: () => Int, nullable: true }) page = 1,
    @Args('pageSize', { type: () => Int, nullable: true }) pageSize = 10,
    @Args('filterBy', { type: () => String, nullable: true }) filterBy?: string,
    @Args('filter', { type: () => String, nullable: true }) filter?: string,
    @Args('sort', { type: () => SortInput, nullable: true })
    sort?: {
      field: string;
      direction: 'ASC' | 'DESC';
    },
    @Args('clubId', { type: () => Int, nullable: true }) clubId = 1,
  ) {
    try {
      const [courts, totalRecords] =
        await this.courtManagementService.findAllWithRelations({
          page,
          pageSize,
          filterBy,
          filter,
          sort,
          clubId,
        });

      return { courts, totalRecords };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Query(() => Court)
  async getCourtById(@Args('courtId') courtId: number) {
    try {
      const courts =
        await this.courtManagementService.findOneWithRelations(courtId);

      return courts;
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => Court)
  async upsertCourt(
    @Args('input') upsertCourtInputDto: UpsertCourtInputDto,
  ): Promise<Court> {
    try {
      return this.courtManagementService.upsertCourt(upsertCourtInputDto);
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
