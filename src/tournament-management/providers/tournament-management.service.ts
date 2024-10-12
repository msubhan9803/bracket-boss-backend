import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';
import { SportManagementService } from 'src/sport-management/providers/sport-management.service';
import { SportName } from 'src/sport-management/types/sport.enums';
import { CreateTournamentInputDto } from '../dtos/create-tournament-input.dto';
import { ClubsService } from 'src/clubs/providers/clubs.service';
import { BracketManagementService } from 'src/bracket-management/providers/bracket-management.service';

@Injectable()
export class TournamentManagementService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    private sportManagementService: SportManagementService,
    private clubsService: ClubsService,
    private bracketManagementService: BracketManagementService,
  ) {}

  async createTournament(
    createTournamentDto: CreateTournamentInputDto,
  ): Promise<Tournament> {
    const sport = await this.sportManagementService.findSportByName(
      SportName.pickleball,
    );

    const club = await this.clubsService.findOne(createTournamentDto.clubId);

    const bracket = await this.bracketManagementService.findOne(
      createTournamentDto.bracketId,
    );

    const newTournament = this.tournamentRepository.create({
      name: createTournamentDto.name,
      description: createTournamentDto.description,
      start_date: createTournamentDto.start_date,
      end_date: createTournamentDto.end_date,
      isPrivate: createTournamentDto.isPrivate,
      club,
      sport,
      bracket,
    });

    return this.tournamentRepository.save(newTournament);
  }
}
