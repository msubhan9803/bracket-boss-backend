import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SchedulingService } from './providers/scheduling.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import { GetScheduleOfTournamentInput } from './dtos/get-schedule-of-tournament-input.dto';
import { TournamentManagementService } from 'src/tournament-management/providers/tournament-management.service';
import { GetScheduleOfTournamentResponseDto } from './dtos/get-schedule-of-tournament-response.dto';
import messages from 'src/utils/messages';

@Resolver()
export class SchedulingResolver {
  constructor(
    private readonly schedulingService: SchedulingService,
    private readonly tournamentManagementService: TournamentManagementService,
  ) {}

  @UseGuards(AuthCheckGuard)
  @Query(() => GetScheduleOfTournamentResponseDto)
  async getScheduleOfTournament(
    @Args('input') getScheduleOfTournamentInput: GetScheduleOfTournamentInput,
  ) {
    try {
      const { tournamentId, users } = getScheduleOfTournamentInput;

      const tournament =
        await this.tournamentManagementService.findOneWithRelations(
          tournamentId,
          ['format', 'teamGenerationType'],
        );
      if (!tournament) {
        throw new Error(messages.NOT_FOUND);
      }

      const { matches, teams } =
        await this.schedulingService.generateTeamsBasedOnStrategy(
          tournament,
          users,
        );

      return { matches, teams };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  // @UseGuards(AuthCheckGuard)
  // @Mutation()
  // async createSchedule(@Args('input') createScheduleDto: any): Promise<any> {
  //   try {
  //     return this.schedulingService.createSchedule(createScheduleDto);
  //   } catch (error) {
  //     throw new InternalServerErrorException('Error: ', error.message);
  //   }
  // }
}
