import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { TournamentManagementService } from './providers/tournament-management.service';
import { Tournament } from './entities/tournament.entity';
import { CreateTournamentInputDto } from './dtos/create-tournament-input.dto';

@Resolver(() => Tournament)
export class TournamentManagementResolver {
  constructor(
    private readonly tournamentManagementService: TournamentManagementService,
  ) {}

  @Mutation(() => Tournament)
  async createTournament(
    @Args('input') createTournamentDto: CreateTournamentInputDto,
  ): Promise<Tournament> {
    return this.tournamentManagementService.createTournament(
      createTournamentDto,
    );
  }
}
