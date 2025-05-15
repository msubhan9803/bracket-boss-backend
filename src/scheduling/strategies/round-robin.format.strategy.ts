import { Injectable } from '@nestjs/common';
import { FormatStrategy } from '../interface/format-strategy.interface';
import { FormatType } from 'src/format-management/types/format.enums';
import { Team } from 'src/team-management/entities/team.entity';
import { Round } from 'src/round/entities/round.entity';
import { RoundRobinScheduleBuilderService } from '../providers/round-robin-schedule-builder.service';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { Pool } from 'src/pool/entities/pool.entity';
import { Level } from 'src/level/entities/level.entity';
import { CourtScheduleService } from 'src/court-management/providers/court-schedule.service';
import { MatchService } from 'src/match-management/providers/match.service';
import { MatchCourtScheduleService } from 'src/match-management/providers/match-court-schedule.service';
import { MatchStatusTypes } from 'src/match-management/types/common';
import { RoundService } from 'src/round/providers/round.service';
import messages from 'src/utils/messages';
import { RoundStatusTypesEnum } from 'src/round/types/common';
import { CourtManagementService } from 'src/court-management/providers/court-management.service';
import { Match } from 'src/match-management/entities/match.entity';
import { LevelTeamStandingService } from 'src/level/providers/level-team-standing.service';
import { TournamentResultService } from 'src/tournament-management/providers/tournament-result.service';
import { TournamentWinner } from 'src/tournament-management/entities/tournamentWinner.entity';
import { LevelService } from 'src/level/providers/level.service';
import { LevelStatusTypesEnum } from 'src/level/types/common';

@Injectable()
export class RoundRobinStrategy implements FormatStrategy {
  type = FormatType.round_robin;

  constructor(
    private readonly courtScheduleService: CourtScheduleService,
    private readonly matchService: MatchService,
    private readonly matchCourtScheduleService: MatchCourtScheduleService,
    private readonly roundRobinScheduleBuilderService: RoundRobinScheduleBuilderService,
    private readonly roundService: RoundService,
    private readonly courtManagementService: CourtManagementService,
    private readonly levelTeamStandingService: LevelTeamStandingService,
    private readonly tournamentResultService: TournamentResultService,
    private readonly levelService: LevelService,
  ) { }

  async createInitialRounds(tournament: Tournament, level: Level, pool: Pool, teams: Team[]): Promise<Round[]> {
    const draftMatchList = this.roundRobinScheduleBuilderService.generateRoundRobinMatches(teams);
    const draftedRoundsWithMatches = this.roundRobinScheduleBuilderService.draftOutRoundsWithMatches(draftMatchList);

    const roundList: Round[] = [];

    const timeSlotWithCourts = await this.courtManagementService.getAvailableCourts(tournament.start_date, tournament.end_date);

    for (let index = 0; index < Object.keys(draftedRoundsWithMatches).length; index++) {
      const roundKey = Object.keys(draftedRoundsWithMatches)[index];
      const roundMatches = draftedRoundsWithMatches[roundKey];
      const round = await this.roundService.createRound({
        name: `Round ${index + 1}`,
        tournament,
        pool,
        order: index + 1,
        status: RoundStatusTypesEnum.not_started,
      });

      const createdMatches: Match[] = [];

      const matchTimeslotMapping = this.matchCourtScheduleService.validateAndAssignTimeslots(
        {
          [roundKey]: roundMatches,
        },
        timeSlotWithCourts,
      );

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

      await this.roundRobinScheduleBuilderService.createMatchRounds(createdMatches, tournament, tournament.matchBestOfRounds);

      roundList.push({
        ...round,
        matches: createdMatches,
      });
    }

    return roundList;
  }

  async handleEndRound(level: Level, poolId: number) {
    const rounds = await this.roundService.findRoundsByPoolId(poolId);
    const currentRound = await this.roundService.findInProgressRoundByPoolId(poolId);

    if (!currentRound.matches.every(match => match.status === MatchStatusTypes.completed)) {
      throw new Error("Can't move to next round as some of the Matches aren't completed yet");
    }
    await this.roundService.updateRoundStatus(currentRound.id, RoundStatusTypesEnum.completed);

    const nextRound = rounds.find(round => round.order === currentRound.order + 1);
    if (nextRound) {
      await this.roundService.updateRoundStatus(nextRound.id, RoundStatusTypesEnum.in_progress);
    }

    const allLevels = await this.levelService.findAllByTournamentWithRelations(level.tournament)
    const lastLevel = allLevels.pop();
    const isLastLevel = level.id === lastLevel.id;
    const lastRound = rounds.pop();
    const isLastRound = currentRound.id === lastRound.id;
    
    if (isLastLevel && isLastRound) {
      await this.levelService.updateLevel(level.id, { 
        status: LevelStatusTypesEnum.completed 
      });
    }
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
