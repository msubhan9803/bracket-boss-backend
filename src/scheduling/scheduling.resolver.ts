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
import { UsersService } from 'src/users/providers/users.service';
import { PredefinedSystemRoles } from 'src/common/types/global';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { ScheduleSpreadsheetHandlerService } from './providers/schedule-spreadsheet-handler.service';
import { BulkMatchImportResponseDto } from './dtos/bulk-match-import-response.dto';

@Resolver()
export class SchedulingResolver {
  constructor(
    private readonly schedulingService: SchedulingService,
    private readonly tournamentManagementService: TournamentManagementService,
    private usersService: UsersService,
    private readonly scheduleSpreadsheetHandlerService: ScheduleSpreadsheetHandlerService,
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
          ['poolPlayFormat', 'playOffFormat', 'teamGenerationType'],
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

  @UseGuards(AuthCheckGuard)
  @Mutation(() => String, { description: 'Download user data for schedule' })
  async downloadUserDataForSchedule() {
    try {
      const users = await this.usersService.findAll(PredefinedSystemRoles.player);

      if (!users || users.length === 0) {
        throw new Error('No users found for the given tournament.');
      }

      const templateBase64String = await this.scheduleSpreadsheetHandlerService.generateUserDataForScheduleTemplate(users);

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

      const templateBase64String = await this.scheduleSpreadsheetHandlerService.generateEmptyScheduleTemplate(clubId, tournamentId);

      return templateBase64String;
    } catch (error) {
      throw new Error(`Error generating Excel file: ${error.message}`);
    }
  }

  @Mutation(() => BulkMatchImportResponseDto)
  async bulkMatchImport(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<any> {
    const parsedScheduleData = await this.scheduleSpreadsheetHandlerService.parseMatchScheduleFromTemplate(file)

    await this.schedulingService.createSchedule(parsedScheduleData);

    return {
      message: messages.MATCH_SCHEDULE_CREATED_SUCCESSFULLY,
    };
  }
}
