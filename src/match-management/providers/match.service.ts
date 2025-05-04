import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from '../entities/match.entity';
import { Repository, FindManyOptions, Between, Equal, In } from 'typeorm';
import { CreateMatchInputDto } from '../dtos/create-match-input.dto';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { FilterMatchesInputDto } from '../dtos/filter-matches-input.dto';
import { MatchStatusTypes } from '../types/common';
import { MatchRoundService } from './match-round.service';

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
  ) {}

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
}
