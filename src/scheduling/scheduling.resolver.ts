import { Args, Query, Resolver } from '@nestjs/graphql';
import { SchedulingService } from './providers/scheduling.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import { GetScheduleOfTournamentInput } from './dtos/get-schedule-of-tournament.dto';
import { TournamentManagementService } from 'src/tournament-management/providers/tournament-management.service';

@Resolver()
export class SchedulingResolver {
  constructor(
    private readonly schedulingService: SchedulingService,
    private readonly tournamentManagementService: TournamentManagementService,
  ) {}

  @UseGuards(AuthCheckGuard)
  @Query(() => String)
  async getScheduleOfTournament(
    @Args('input') getScheduleOfTournamentInput: GetScheduleOfTournamentInput,
  ) {
    try {
      const { tournamentId, users } = getScheduleOfTournamentInput;

      const tournament =
        await this.tournamentManagementService.findOneWithRelations(
          tournamentId,
          ['bracket'],
        );

      await this.schedulingService.generateTeamsBasedOnStrategy(
        tournament,
        users,
      );

      return 'Schedule generated successfully';
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
