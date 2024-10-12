import { Query, Resolver } from '@nestjs/graphql';
import { Bracket } from './entities/bracket.entity';
import { BracketManagementService } from './providers/bracket-management.service';
import { InternalServerErrorException } from '@nestjs/common';

@Resolver(() => Bracket)
export class BracketManagementResolver {
  constructor(
    private readonly bracketManagementService: BracketManagementService,
  ) {}

  @Query(() => [Bracket])
  async getAllBrackets() {
    try {
      return await this.bracketManagementService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
