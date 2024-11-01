import { Query, Resolver } from '@nestjs/graphql';
import { Format } from './entities/format.entity';
import { FormatManagementService } from './providers/format-management.service';
import { InternalServerErrorException } from '@nestjs/common';

@Resolver(() => Format)
export class FormatManagementResolver {
  constructor(
    private readonly formatManagementService: FormatManagementService,
  ) {}

  @Query(() => [Format])
  async getAllFormats() {
    try {
      return await this.formatManagementService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
