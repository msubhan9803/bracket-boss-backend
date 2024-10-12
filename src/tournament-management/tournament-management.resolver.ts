import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { TournamentManagementService } from './providers/tournament-management.service';
import { Tournament } from './entities/tournament.entity';
import { CreateTournamentInputDto } from './dtos/create-tournament-input.dto';
import { InternalServerErrorException } from '@nestjs/common';

@Resolver(() => Tournament)
export class TournamentManagementResolver {
  constructor(
    private readonly tournamentManagementService: TournamentManagementService,
  ) {}

  @Query(() => [Tournament])
  async getAllTournaments() {
    try {
      return await this.tournamentManagementService.findAllWithRelations();
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
}
