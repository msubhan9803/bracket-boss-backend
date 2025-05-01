import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';
import { SportManagementService } from 'src/sport-management/providers/sport-management.service';
import { SportName } from 'src/sport-management/types/sport.enums';
import { CreateTournamentInputDto } from '../dtos/create-tournament-input.dto';
import { FormatManagementService } from 'src/format-management/providers/format-management.service';
import { TeamGenerationTypeManagementService } from 'src/team-generation-type-management/providers/team-generation-type-management.service';
import { TournamentStatusTypesEnum } from '../types/common';

@Injectable()
export class TournamentManagementService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    private sportManagementService: SportManagementService,
    private formatManagementService: FormatManagementService,
    private teamGenerationTypeManagementService: TeamGenerationTypeManagementService,
  ) {}

  findAll(): Promise<Tournament[]> {
    return this.tournamentRepository.find();
  }

  async findAllWithRelations(options: {
    page: number;
    pageSize: number;
    filterBy?: string;
    filter?: string;
    sort?: { field: string; direction: 'ASC' | 'DESC' };
    relations?: string[];
  }): Promise<[Tournament[], number]> {
    const { page, pageSize, filterBy, filter, sort } = options;

    const query = this.tournamentRepository
      .createQueryBuilder('tournament')
      .leftJoinAndSelect('tournament.sport', 'sport')
      .leftJoinAndSelect('tournament.poolPlayFormat', 'poolPlayFormat')
      .leftJoinAndSelect('tournament.playOffFormat', 'playOffFormat')
      .leftJoinAndSelect('tournament.teamGenerationType', 'teamGenerationType')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (filterBy && filter) {
      query.andWhere(`tournament.${filterBy} LIKE :filter`, {
        filter: `%${filter}%`,
      });
    }

    if (sort) {
      query.orderBy(`tournament.${sort.field}`, sort.direction);
    }

    const [tournaments, totalRecords] = await query.getManyAndCount();

    return [tournaments, totalRecords];
  }

  findOne(id: number): Promise<Tournament> {
    return this.tournamentRepository.findOneBy({ id });
  }

  findOneWithRelations(
    tournamentId: number,
    relations: string[] = ['sport', 'poolPlayFormat', 'playOffFormat', 'teamGenerationType'],
  ): Promise<Tournament> {
    return this.tournamentRepository.findOne({
      where: { id: tournamentId },
      relations,
    });
  }

  async createTournament(createTournamentDto: CreateTournamentInputDto): Promise<Tournament> {
    const sport = await this.sportManagementService.findSportByName(SportName.pickleball);

    const poolPlayFormat = await this.formatManagementService.findOne(createTournamentDto.poolPlayFormatId);

    const playOffFormat = await this.formatManagementService.findOne(createTournamentDto.poolPlayFormatId);

    const teamGenerationType = await this.teamGenerationTypeManagementService.findOne(
      createTournamentDto.teamGenerationTypeId,
    );

    const newTournament = this.tournamentRepository.create({
      name: createTournamentDto.name,
      description: createTournamentDto.description,
      start_date: createTournamentDto.start_date,
      end_date: createTournamentDto.end_date,
      isPrivate: createTournamentDto.isPrivate,
      sport,
      poolPlayFormat,
      playOffFormat,
      teamGenerationType,
      splitSwitchGroupBy: createTournamentDto.splitSwitchGroupBy,
      matchBestOfRounds: createTournamentDto.matchBestOfRounds,
      status: TournamentStatusTypesEnum.not_started,
      numberOfPools: createTournamentDto.numberOfPools,
    });

    return this.tournamentRepository.save(newTournament);
  }

  async update(tournamentId: number, updatedTournament: Partial<Tournament>): Promise<Tournament> {
    await this.tournamentRepository.update(tournamentId, updatedTournament);

    try {
      const tournament = await this.findOneWithRelations(tournamentId);
      if (!tournament) {
        throw new Error(`Tournament with ID ${tournamentId} not found`);
      }
      return tournament;
    } catch (error) {
      throw new Error(`Error finding tournament: ${error.message}`);
    }
  }

  async startTournament(tournamentId: number): Promise<Tournament> {
    const tournament = await this.findOneWithRelations(tournamentId);
    if (!tournament) {
      throw new Error(`Tournament with ID ${tournamentId} not found`);
    }

    return this.update(tournamentId, {
      status: TournamentStatusTypesEnum.pool_play_in_progress,
    });
  }
}
