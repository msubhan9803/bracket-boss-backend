import { Injectable } from '@nestjs/common';
import { FormatStrategy } from '../interface/format-strategy.interface';
import { FormatType } from 'src/format-management/types/format.enums';
import { Level } from 'src/level/entities/level.entity';
import { LevelTeamStanding } from 'src/level/entities/level-team-standing.entity';
import { Pool } from 'src/pool/entities/pool.entity';
import { Round } from 'src/round/entities/round.entity';
import { Team } from 'src/team-management/entities/team.entity';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { RoundService } from 'src/round/providers/round.service';
import { RoundStatusTypesEnum } from 'src/round/types/common';
import { SingleEliminationScheduleBuilderService } from '../providers/single-elimination-schedule-builder.service';
import { CourtManagementService } from 'src/court-management/providers/court-management.service';
import { MatchCourtScheduleService } from 'src/match-management/providers/match-court-schedule.service';
import messages from 'src/utils/messages';
import { CourtScheduleService } from 'src/court-management/providers/court-schedule.service';
import { MatchService } from 'src/match-management/providers/match.service';
import { MatchStatusTypes } from 'src/match-management/types/common';

@Injectable()
export class SingleEliminationStrategy implements FormatStrategy {
  type = FormatType.single_elimination;

  constructor(
    private readonly matchCourtScheduleService: MatchCourtScheduleService,
    private readonly roundService: RoundService,
    private readonly singleEliminationScheduleBuilderService: SingleEliminationScheduleBuilderService,
    private readonly courtManagementService: CourtManagementService,
    private readonly courtScheduleService: CourtScheduleService,
    private readonly matchService: MatchService,
  ) { }

  async createInitialRounds(tournament: Tournament, level: Level, pool: Pool, teams: Team[]): Promise<Round[]> {
    const draftMatchList = this.singleEliminationScheduleBuilderService.generateSingleEliminationMatches(teams);
    const timeSlotWithCourts = await this.courtManagementService.getAvailableCourts(tournament.start_date, tournament.end_date);

    const round = await this.roundService.createRound({
      name: 'Round 1',
      tournament,
      pool,
      order: 1,
      status: RoundStatusTypesEnum.in_progress,
    });

    const matchTimeslotMapping = this.matchCourtScheduleService.validateAndAssignTimeslots(
      {
        round1: { matches: draftMatchList },
      },
      timeSlotWithCourts,
    );

    let createdMatches = [];

    for (const [match, courtScheduleElem] of matchTimeslotMapping.entries()) {
      const { courtScheduleId, date, startTime } = courtScheduleElem;
      const courtSchedule = await this.courtScheduleService.findOneByID(courtScheduleId);

      const homeTeam = match.teams[0];
      const awayTeam = match.teams[1];

      if (!homeTeam || !awayTeam) {
        throw new Error(messages.TEAM_NOT_FOUND_FOR_MATCH);
      }

      const matchDate = new Date(`${date}T${startTime}`);

      const createdMatch = await this.matchService.createMatch({
        title: match.title,
        tournament,
        homeTeam,
        awayTeam,
        status: MatchStatusTypes.not_started,
        level,
        pool,
        round,
      });
      createdMatches.push(createdMatch);

      await this.matchCourtScheduleService.createMatchCourtScheduleRelation(createdMatch, courtSchedule, matchDate);
    }

    await this.singleEliminationScheduleBuilderService.createMatchRounds(createdMatches, tournament, tournament.matchBestOfRounds);

    const roundList: Round[] = [{
      ...round,
      matches: createdMatches,
    }];

    return roundList;
  }

  handleEndRound(poolId: number) {
    throw new Error('Method not implemented.');
  }

  async selectTeams(levelTeamStandings: LevelTeamStanding[]): Promise<Team[]> {
    if (!levelTeamStandings || levelTeamStandings.length < 4) {
      throw new Error('Not enough teams available for single elimination tournament. Need at least 4 teams.');
    }

    const topTeams = levelTeamStandings
      .slice(0, 4)
      .map(standing => standing.team);

    return topTeams;
  }
}
