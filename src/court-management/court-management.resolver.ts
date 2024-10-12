import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CourtManagementService } from './providers/court-management.service';
import { Court } from './entities/court.entity';
import { CreateCourtInputDto } from './dtos/create-court-input.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { CourtListResponse } from './dtos/get-all-courts-response.dto';
import { SortInput } from 'src/common/dtos/sort-input.dto';

@Resolver()
export class CourtManagementResolver {
  constructor(
    private readonly courtManagementService: CourtManagementService,
  ) {}

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
  ) {
    try {
      const [courts, totalRecords] =
        await this.courtManagementService.findAllWithRelations({
          page,
          pageSize,
          filterBy,
          filter,
          sort,
        });

      return { courts, totalRecords };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

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

  @Mutation(() => Court)
  async createCourt(
    @Args('input') createCourtInputDto: CreateCourtInputDto,
  ): Promise<Court> {
    try {
      return this.courtManagementService.createCourt(createCourtInputDto);
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
