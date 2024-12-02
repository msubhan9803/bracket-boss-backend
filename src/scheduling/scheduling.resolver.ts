import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as path from 'path';
import { Workbook, Worksheet } from 'exceljs';
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

@Resolver()
export class SchedulingResolver {
  private readonly uploadDir = path.resolve('uploads');

  constructor(
    private readonly schedulingService: SchedulingService,
    private readonly tournamentManagementService: TournamentManagementService,
    private usersService: UsersService,
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

  @UseGuards(AuthCheckGuard)
  @Mutation(() => String, { description: 'Download user data for schedule' })
  async downloadUserDataForSchedule() {
    try {
      const backgroundColor = '9cccff';

      const users = await this.usersService.findAll(PredefinedSystemRoles.player);

      if (!users || users.length === 0) {
        throw new Error('No users found for the given tournament.');
      }

      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Users');

      const headers = ['Name', 'User Id', 'Email'];
      const headerRow = worksheet.addRow(headers);

      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: backgroundColor },
        };
      });

      users.forEach(user => {
        worksheet.addRow([user.name, user.id, user.email]);
      });

      worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
          const cellValue = cell.value ? cell.value.toString() : '';
          maxLength = Math.max(maxLength, cellValue.length);
        });
        column.width = maxLength + 2;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const base64String = (buffer as Buffer).toString("base64");

      return base64String;
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

      const backgroundColor = '9cccff';
      const disabledBackgroundColor = 'b5b5b5';

      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Users');

      /**
       * Club & Tournament Ids
       */
      const clubTournamentIdHeader = ['Club Id', 'Tournament Id'];
      const headerRow = worksheet.addRow(clubTournamentIdHeader);

      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: backgroundColor },
        };
      });

      const clubTournamentIdData = worksheet.addRow([clubId, tournamentId]);
      clubTournamentIdData.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: disabledBackgroundColor },
        };
      });

      this.addEmptyRow(worksheet);

      /**
       * Match Heading
       */
      const matchHeadingRow = worksheet.addRow(['Matches']);
      matchHeadingRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: backgroundColor },
        };
      });

      /**
       * Match Heading
       */
      const matchHeaders = ['Match Date', 'Team 1 Name', 'Team 1 User 1', 'Team 1 User 2', 'Team 2 Name', 'Team 2 User 1', 'Team 2 User 2'];
      const matchHeadersRow = worksheet.addRow(matchHeaders);
      matchHeadersRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: backgroundColor },
        };
      });

      /**
       * Set column width based on the maximum length of the cell value
       */
      worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
          const cellValue = cell.value ? cell.value.toString() : '';
          maxLength = Math.max(maxLength, cellValue.length);
        });
        column.width = maxLength + 2;
      });

      /**
       * Convert workbook to base64 string
       */
      const buffer = await workbook.xlsx.writeBuffer();
      const base64String = (buffer as Buffer).toString("base64");

      return base64String;
    } catch (error) {
      throw new Error(`Error generating Excel file: ${error.message}`);
    }
  }

  async addEmptyRow(worksheet: Worksheet) {
    worksheet.addRow(['']);
  }
}
