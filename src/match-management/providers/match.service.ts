import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from '../entities/match.entity';
import { Repository, FindManyOptions, Between, Equal, In } from 'typeorm';
import { CreateMatchInputDto } from '../dtos/create-match-input.dto';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { FilterMatchesInputDto } from '../dtos/filter-matches-input.dto';
import { MatchResultType, MatchRoundStatusTypes, MatchStatusTypes } from '../types/common';
import { MatchRoundService } from './match-round.service';
import { LevelTeamStandingService } from 'src/level/providers/level-team-standing.service';

@Injectable()
export class MatchService {
  private readonly commonMatchRelationships = [
    'tournament',
    'round',
    'homeTeam',
    'homeTeam.users',
    'awayTeam',
    'awayTeam.users',
    'winnerTeam',
    'matchCourtSchedule',
    'matchRounds',
    'matchRounds.matchRoundScore',
    'matchCourtSchedule.courtSchedule',
    'matchCourtSchedule.courtSchedule.court',
    'matchCourtSchedule.courtSchedule.day',
    'matchCourtSchedule.courtSchedule.timeSlot',
    'level',
    'pool',
  ];

  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly matchRoundService: MatchRoundService,
    private readonly levelTeamStandingService: LevelTeamStandingService,
  ) { }

  findMatchById(
    matchId: number,
    relations: string[] = this.commonMatchRelationships,
  ): Promise<Match> {
    return this.matchRepository.findOne({
      where: { id: matchId },
      relations,
      order: { matchRounds: { matchRoundNumber: "ASC" } }
    });
  }

  findMatchesByTournament(
    tournament: Tournament,
    relations: string[] = this.commonMatchRelationships,
  ): Promise<Match[]> {
    return this.matchRepository.find({
      where: { tournament: { id: tournament.id } },
      relations,
    });
  }

  findMatchesByRoundId(
    roundId: number,
    relations: string[] = this.commonMatchRelationships,
  ): Promise<Match[]> {
    return this.matchRepository.find({
      where: { round: { id: roundId } },
      relations,
    });
  }

  createMatch(match: CreateMatchInputDto): Promise<Match> {
    return this.matchRepository.save(match);
  }

  async deleteMatch(match: Match) {
    await this.matchRepository.delete({ id: match.id });
  }

  async findAllWithFilters(filters: FilterMatchesInputDto): Promise<Match[]> {
    const baseWhere: FindManyOptions['where'] = {
      tournament: { id: filters.tournamentId },
      ...(filters?.levels?.length && { level: { id: In(filters.levels) } }),
      ...(filters?.pools?.length && { pool: { id: In(filters.pools) } }),
      ...(filters?.rounds?.length && { round: { id: In(filters.rounds) } }),
      ...(filters.status && { status: In(filters.status) }),
    };
    const relations: string[] = this.commonMatchRelationships;

    if (filters.courts || filters.date || filters.startTime || filters.endTime) {
      baseWhere['matchCourtSchedule'] = {};

      if (filters.courts.length > 0) {
        baseWhere['matchCourtSchedule'].courtSchedule = {
          court: { id: In(filters.courts) },
        };
      }

      if (filters.date) {
        baseWhere['matchCourtSchedule'].matchDate = Equal(filters.date);
      }

      if (filters.startTime && filters.endTime) {
        baseWhere['matchCourtSchedule'].courtSchedule = {
          ...baseWhere['matchCourtSchedule'].courtSchedule,
          timeSlot: {
            startTime: Between(filters.startTime, filters.endTime),
            endTime: Between(filters.startTime, filters.endTime),
          },
        };
      } else if (filters.startTime) {
        baseWhere['matchCourtSchedule'].courtSchedule = {
          ...baseWhere['matchCourtSchedule'].courtSchedule,
          timeSlot: { startTime: Equal(filters.startTime) },
        };
      } else if (filters.endTime) {
        baseWhere['matchCourtSchedule'].courtSchedule = {
          ...baseWhere['matchCourtSchedule'].courtSchedule,
          timeSlot: { endTime: Equal(filters.endTime) },
        };
      }
    }

    let whereConditions: any[] = [baseWhere];

    if (filters?.teams?.length > 0) {
      whereConditions = [
        { ...baseWhere, homeTeam: { id: In(filters.teams) } },
        { ...baseWhere, awayTeam: { id: In(filters.teams) } },
      ];
    }

    const matches = await this.matchRepository.find({
      where: whereConditions,
      relations,
    });

    return matches;
  }

  async startMatch(matchId: number) {
    await this.matchRepository.update(matchId, { status: MatchStatusTypes.in_progress });

    const matchRounds = await this.matchRoundService.findAllRoundsByMatchId(matchId);
    await this.matchRoundService.startMatchRound(matchRounds[0]);

    return this.findMatchById(matchId);
  }

  // async endMatch(matchId: number) {
  //   const matchRounds = await this.matchRoundService.findAllRoundsByMatchId(matchId);
  //   if (matchRounds.some(
  //       matchRound => matchRound.status === MatchRoundStatusTypes.not_started ||
  //       matchRound.status === MatchRoundStatusTypes.in_progress)
  //   ) {
  //     throw new Error("Unable to end match as all of the match rounds aren't completed yet.")
  //   }

  //   /**
  //    * Update Match status
  //    * Select Winning Team
  //    */
  //   const match = await this.findMatchById(matchId);
  //   await this.matchRepository.update(match, { status: MatchStatusTypes.completed })


  //   /**
  //    * Update Level standings for winning team
  //    */


  //   return this.findMatchById(matchId);
  // }


  async endMatch(matchId: number) {
    /**
     * Verify that all match rounds are completed before ending the match
     */
    const matchRounds = await this.matchRoundService.findAllRoundsByMatchId(matchId);
    if (matchRounds.some(
      matchRound => matchRound.status === MatchRoundStatusTypes.not_started ||
        matchRound.status === MatchRoundStatusTypes.in_progress)
    ) {
      throw new Error("Unable to end match as all of the match rounds aren't completed yet.")
    }

    const match = await this.findMatchById(matchId);

    /**
     * Determine the winning team.
     */
    const homeTeamWins = match.matchRounds.filter(round => round?.matchRoundScore?.homeTeamScore > round?.matchRoundScore?.awayTeamScore).length;
    const awayTeamWins = match.matchRounds.filter(round => round?.matchRoundScore?.awayTeamScore > round?.matchRoundScore?.homeTeamScore).length;
    let winningTeam;
    if (homeTeamWins > awayTeamWins) {
      winningTeam = match.homeTeam;
      match.resultType = MatchResultType.WINNER;
    } else if (awayTeamWins > homeTeamWins) {
      winningTeam = match.awayTeam;
      match.resultType = MatchResultType.WINNER;
    } else {
      winningTeam = null;
      match.resultType = MatchResultType.TIE;
    }

    match.winnerTeam = winningTeam;
    await this.matchRepository.save(match);


    /**
     * 2. Calculate the score statistics.
     */
    let homeTeamPointsScored = 0;
    let awayTeamPointsScored = 0;

    match.matchRounds.forEach(round => {
      homeTeamPointsScored += round?.matchRoundScore?.homeTeamScore || 0;
      awayTeamPointsScored += round?.matchRoundScore?.awayTeamScore || 0;
    });

    /**
     * 3. Update the LevelTeamStanding for both teams.
     */
    await this.levelTeamStandingService.updateLevelTeamStanding(match.level.id, match.homeTeam.id, {
      pointsScored: homeTeamPointsScored,
      pointsAgainst: awayTeamPointsScored,
      wins: winningTeam?.id === match.homeTeam.id ? 1 : 0,
      losses: winningTeam?.id === match.homeTeam.id ? 0 : 1,
    }, match.matchRounds.length);

    await this.levelTeamStandingService.updateLevelTeamStanding(match.level.id, match.awayTeam.id, {
      pointsScored: awayTeamPointsScored,
      pointsAgainst: homeTeamPointsScored,
      wins: winningTeam?.id === match.awayTeam.id ? 1 : 0,
      losses: winningTeam?.id === match.awayTeam.id ? 0 : 1,
    }, match.matchRounds.length);

    await this.matchRepository.update(matchId, { status: MatchStatusTypes.completed });

    return this.findMatchById(matchId);
  }
}
