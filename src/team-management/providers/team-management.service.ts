import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamInputDto } from '../dtos/create-team-input.dto';
import { Team } from '../entities/team.entity';
import { TournamentManagementService } from 'src/tournament-management/providers/tournament-management.service';
import { ClubsService } from 'src/clubs/providers/clubs.service';
import { UsersService } from 'src/users/providers/users.service';
import { TeamsTournamentsUsers } from '../entities/teams-tournaments-users.entity';

@Injectable()
export class TeamManagementService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamsTournamentsUsers)
    private readonly teamsTournamentsUsersRepository: Repository<TeamsTournamentsUsers>,
    private readonly tournamentManagementService: TournamentManagementService,
    private readonly clubsService: ClubsService,
    private readonly usersService: UsersService,
  ) {}

  async findAllWithRelations(options: {
    page: number;
    pageSize: number;
    filterBy?: string;
    filter?: string;
    sort?: { field: string; direction: 'ASC' | 'DESC' };
    relations?: string[];
  }): Promise<[Team[], number]> {
    const { page, pageSize, filterBy, filter, sort } = options;

    const query = this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.club', 'club')
      .leftJoinAndSelect('team.tournament', 'tournament')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (filterBy && filter) {
      query.andWhere(`team.${filterBy} LIKE :filter`, {
        filter: `%${filter}%`,
      });
    }

    if (sort) {
      query.orderBy(`team.${sort.field}`, sort.direction);
    }

    const [teams, totalRecords] = await query.getManyAndCount();

    return [teams, totalRecords];
  }

  async createTeam(createTeamInput: CreateTeamInputDto): Promise<Team> {
    const { tournamentId, clubId, name, userIds } = createTeamInput;

    const tournament =
      await this.tournamentManagementService.findOne(tournamentId);
    const club = await this.clubsService.findOne(clubId);
    const users = await this.usersService.findMultipleUsersById(userIds);

    if (!tournament || !club || users.length !== userIds.length) {
      throw new Error('Invalid tournament, club, or user IDs');
    }

    const newTeam = this.teamRepository.create({
      name,
      tournament,
      club,
    });

    const savedTeam = await this.teamRepository.save(newTeam);

    const teamsTournamentsUsers = userIds.map((userId) => {
      return this.teamsTournamentsUsersRepository.create({
        team: savedTeam,
        tournament,
        club,
        user: users.find((user) => user.id === userId),
      });
    });

    await this.teamsTournamentsUsersRepository.save(teamsTournamentsUsers);

    return savedTeam;
  }
}
