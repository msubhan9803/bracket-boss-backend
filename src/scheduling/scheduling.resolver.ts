import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SchedulingService } from './providers/scheduling.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import messages from 'src/utils/messages';
import { GetScheduleOfTournamentInput } from './dtos/get-schedule-of-tournament-input.dto';
import { DeleteScheduleInputDto } from './dtos/delete-schedule-input.dto';
import { DeleteScheduleResponseDto } from './dtos/delete-schedule-response.dto';
import { UsersService } from 'src/users/providers/users.service';
import { PredefinedSystemRoles } from 'src/common/types/global';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { ScheduleSpreadsheetHandlerService } from './providers/schedule-spreadsheet-handler.service';
import { BulkMatchImportResponseDto } from './dtos/bulk-match-import-response.dto';
import { Level } from 'src/level/entities/level.entity';
import { Team } from 'src/team-management/entities/team.entity';
import { CreateTournamentTeamsInputDto } from 'src/team-management/dtos/create-tournament-teams-input.dto';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { Round } from 'src/round/entities/round.entity';

@Resolver()
export class SchedulingResolver {
  constructor(
    private readonly schedulingService: SchedulingService,
    private readonly usersService: UsersService,
    private readonly scheduleSpreadsheetHandlerService: ScheduleSpreadsheetHandlerService,
  ) {}

  @UseGuards(AuthCheckGuard)
  @Query(() => [Level])
  async getScheduleOfTournament(@Args('input') getScheduleOfTournamentInput: GetScheduleOfTournamentInput) {
    try {
      const { tournamentId } = getScheduleOfTournamentInput;

      const tournament = await this.schedulingService.getScheduleOfTournament(tournamentId);

      return tournament;
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => Level)
  async createSchedule(@Args('tournamentId') tournamentId: number): Promise<Level> {
    try {
      return this.schedulingService.createSchedule(tournamentId);
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => [Round])
  async advanceToNextPoolRound(
    @Args('tournamentId') tournamentId: number,
    @Args('poolId') poolId: number
  ): Promise<Round[]> {
    try {
      return this.schedulingService.advanceToNextPoolRound(tournamentId, poolId);
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => DeleteScheduleResponseDto)
  async deleteSchedule(
    @Args('input') deleteScheduleInputDto: DeleteScheduleInputDto,
  ): Promise<DeleteScheduleResponseDto> {
    try {
      await this.schedulingService.deleteScheduleOfTournament(deleteScheduleInputDto.tournamentId);

      return {
        message: messages.SUCCESS_MESSAGE,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => String, { description: 'Download user data for schedule' })
  async downloadUserDataForSchedule() {
    try {
      const users = await this.usersService.findAll(PredefinedSystemRoles.player);

      if (!users || users.length === 0) {
        throw new Error('No users found for the given tournament.');
      }

      const templateBase64String =
        await this.scheduleSpreadsheetHandlerService.generateUserDataForScheduleTemplate(users);

      return templateBase64String;
    } catch (error) {
      throw new Error(`Error generating Excel file: ${error.message}`);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => String, { description: 'Download empty schedule template' })
  async downloadEmptyScheduleTemplate() {
    try {
      const clubId = 1;
      const tournamentId = 4;

      const templateBase64String = await this.scheduleSpreadsheetHandlerService.generateEmptyScheduleTemplate(
        clubId,
        tournamentId,
      );

      return templateBase64String;
    } catch (error) {
      throw new Error(`Error generating Excel file: ${error.message}`);
    }
  }

  @Mutation(() => BulkMatchImportResponseDto)
  async bulkMatchImport(@Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload): Promise<any> {
    const parsedScheduleData = await this.scheduleSpreadsheetHandlerService.parseMatchScheduleFromTemplate(file);

    await this.schedulingService.createSchedule(parsedScheduleData.tournamentId);

    return {
      message: messages.MATCH_SCHEDULE_CREATED_SUCCESSFULLY,
    };
  }

  @Mutation(() => [Team])
  async createTournamentTeam(
    @Args('input') createTournamentTeamsInputDto: CreateTournamentTeamsInputDto,
  ): Promise<Team[]> {
    return this.schedulingService.createTournamentTeams(createTournamentTeamsInputDto);
  }
}
