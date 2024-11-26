import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SchedulingService } from './providers/scheduling.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import { GetSchedulePreperationDataOfTournamentInput } from './dtos/get-schedule-preperation-data-of-tournament-input.dto';
import { TournamentManagementService } from 'src/tournament-management/providers/tournament-management.service';
import { GetSchedulePreperationDataOfTournamentResponseDto } from './dtos/get-schedule-preperation-data-of-tournament-response.dto';
import messages from 'src/utils/messages';
import { CreateScheduleInputDto } from './dtos/create-schedule-input.dto';
import { CreateScheduleResponseDto } from './dtos/create-schedule-response.dto';
import { GetScheduleOfTournamentInput } from './dtos/get-schedule-of-tournament-input.dto';
import { GetScheduleOfTournamentResponseDto } from './dtos/get-schedule-of-tournament-response.dto';
import { DeleteScheduleInputDto } from './dtos/delete-schedule-input.dto';
import { DeleteScheduleResponseDto } from './dtos/delete-schedule-response.dto';

@Resolver()
export class SchedulingResolver {
  constructor(
    private readonly schedulingService: SchedulingService,
    private readonly tournamentManagementService: TournamentManagementService,
  ) { }

  @UseGuards(AuthCheckGuard)
  @Query(() => GetSchedulePreperationDataOfTournamentResponseDto)
  async getSchedulePreperationDataOfTournament(
    @Args('input') getSchedulePreperationDataOfTournamentInput: GetSchedulePreperationDataOfTournamentInput,
  ) {
    try {
      const { tournamentId, users } = getSchedulePreperationDataOfTournamentInput;

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

  @UseGuards(AuthCheckGuard)
  @Query(() => GetScheduleOfTournamentResponseDto)
  async getScheduleOfTournament(
    @Args('input') getScheduleOfTournamentInput: GetScheduleOfTournamentInput,
  ) {
    try {
      const { tournamentId } = getScheduleOfTournamentInput;

      const schedule = await this.schedulingService.getScheduleOfTournament(
        tournamentId,
      );

      return { schedule }
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => CreateScheduleResponseDto)
  async createSchedule(@Args('input') createScheduleDto: CreateScheduleInputDto): Promise<CreateScheduleResponseDto> {
    try {
      return this.schedulingService.createSchedule(createScheduleDto);
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => DeleteScheduleResponseDto)
  async deleteSchedule(@Args('input') deleteScheduleInputDto: DeleteScheduleInputDto): Promise<DeleteScheduleResponseDto> {
    try {
      await this.schedulingService.deleteScheduleOfTournament(deleteScheduleInputDto.tournamentId);

      return {
        message: messages.SUCCESS_MESSAGE
      };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
