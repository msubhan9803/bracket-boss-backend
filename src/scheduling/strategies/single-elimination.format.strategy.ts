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
import { PoolService } from 'src/pool/providers/pool.service';
import { LevelService } from 'src/level/providers/level.service';
import { LevelStatusTypesEnum } from 'src/level/types/common';
import { LevelTeamStandingService } from 'src/level/providers/level-team-standing.service';
import { TournamentResultService } from 'src/tournament-management/providers/tournament-result.service';
import { TournamentWinner } from 'src/tournament-management/entities/tournamentWinner.entity';

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
    private readonly poolService: PoolService,
    private readonly levelService: LevelService,
    private readonly levelTeamStandingService: LevelTeamStandingService,
    private readonly tournamentResultService: TournamentResultService,
  ) { }

  async createInitialRounds(
    tournament: Tournament,
    level: Level,
    pool: Pool,
    teams: Team[],
  ): Promise<Round[]> {
    const draftMatchList =
      this.singleEliminationScheduleBuilderService.generateSingleEliminationMatches(teams);
    const timeSlotWithCourts = await this.courtManagementService.getAvailableCourts(
      tournament.start_date,
      tournament.end_date,
    );

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

    const createdMatches = [];

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

      await this.matchCourtScheduleService.createMatchCourtScheduleRelation(
        createdMatch,
        courtSchedule,
        matchDate,
      );
    }

    await this.singleEliminationScheduleBuilderService.createMatchRounds(
      createdMatches,
      tournament,
      tournament.matchBestOfRounds,
    );

    const roundList: Round[] = [
      {
        ...round,
        matches: createdMatches,
      },
    ];

    return roundList;
  }

  async handleEndRound(level: Level, poolId: number) {
    const pool = await this.poolService.getPoolById(poolId);
    const { tournament } = pool;

    const rounds = await this.roundService.findRoundsByPoolId(poolId, [
      'matches',
      'matches.winnerTeam',
    ]);
    const currentRoundIndex = rounds.findIndex(
      (round) => round.status === RoundStatusTypesEnum.in_progress,
    );
    const currentRound = rounds[currentRoundIndex];

    if (!currentRound) {
      throw new Error('No round in progress found for this pool');
    }

    const matchesOfCurrentRound = await this.matchService.findMatchesByRoundId(currentRound.id);
    const incompleteMatches = matchesOfCurrentRound.filter(
      (match) => match.status !== MatchStatusTypes.completed,
    );
    if (incompleteMatches.length > 0) {
      throw new Error(
        `Cannot end round ${currentRound.name} in ${level.name} as ${incompleteMatches.length} match(es) still incomplete`,
      );
    }

    const winningTeams = matchesOfCurrentRound.map((match) => match.winnerTeam);

    await this.roundService.updateRoundStatus(currentRound.id, RoundStatusTypesEnum.completed);

    /**
     * Tournament winner found - mark current round as completed
     * This means Last Level's last Round is completed so update status of both Level/Round
     */
    if (winningTeams.length === 1) {
      await this.levelService.updateLevel(level.id, { status: LevelStatusTypesEnum.completed });

      return [];
    }

    const round = await this.roundService.createRound({
      name: `Round ${currentRoundIndex + 2}`, // Round 1 => Round 2
      tournament,
      pool,
      order: currentRound.order + 1,
      status: RoundStatusTypesEnum.in_progress,
    });

    const draftMatchList =
      this.singleEliminationScheduleBuilderService.generateSingleEliminationMatches(winningTeams);
    const timeSlotWithCourts = await this.courtManagementService.getAvailableCourts(
      tournament.start_date,
      tournament.end_date,
    );

    const matchTimeslotMapping = this.matchCourtScheduleService.validateAndAssignTimeslots(
      {
        round1: { matches: draftMatchList },
      },
      timeSlotWithCourts,
    );

    const createdMatches = [];

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

      await this.matchCourtScheduleService.createMatchCourtScheduleRelation(
        createdMatch,
        courtSchedule,
        matchDate,
      );
    }

    await this.singleEliminationScheduleBuilderService.createMatchRounds(
      createdMatches,
      tournament,
      tournament.matchBestOfRounds,
    );

    const roundList: Round[] = [
      {
        ...round,
        matches: createdMatches,
      },
    ];

    return roundList;
  }

  async selectTeams(levelTeamStandings: LevelTeamStanding[]): Promise<Team[]> {
    if (!levelTeamStandings || levelTeamStandings.length < 4) {
      throw new Error(
        'Not enough teams available for single elimination tournament. Need at least 4 teams.',
      );
    }

    const topTeams = levelTeamStandings.slice(0, 4).map((standing) => standing.team);

    return topTeams;
  }

  async concludeTournament(tournament: Tournament): Promise<void> {
    const levels = tournament.levels;
    const lastLevel = levels.pop();

    const levelTeamStandings = await this.levelTeamStandingService.findAllByLevelId({
      levelId: lastLevel.id,
    });
    const topThreeStandings = levelTeamStandings.slice(0, 3);

    await this.tournamentResultService.createTournamentResult({
      tournament,
      winners: topThreeStandings.map((standing, index) => 
        new TournamentWinner({
          tournament,
          team: standing.team,
          rank: index + 1,
        })
      )
    });
  }
}
