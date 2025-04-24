import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamInputDto } from '../dtos/create-team-input.dto';
import { Team } from '../entities/team.entity';
import { TournamentManagementService } from 'src/tournament-management/providers/tournament-management.service';
import { ClubsService } from 'src/clubs/providers/clubs.service';
import { UsersService } from 'src/users/providers/users.service';
import { TeamStatusTypes } from '../types/common';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { CreateTournamentTeamsInputDto } from '../dtos/create-tournament-teams-input.dto';

@Injectable()
export class TeamManagementService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
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
      .leftJoinAndSelect('team.users', 'users')
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

  async findTeamsByTournament(tournament: Tournament): Promise<Team[]> {
    return this.teamRepository.find({
      where: { tournament: { id: tournament.id } },
    });
  }

  async createTeam(createTeamInput: CreateTeamInputDto): Promise<Team> {
    const { tournamentId, name, userIds } = createTeamInput;

    const tournament =
      await this.tournamentManagementService.findOne(tournamentId);
    const users = await this.usersService.findMultipleUsersById(userIds);

    if (!tournament || users.length !== userIds.length) {
      throw new Error('Invalid tournament, club, or user IDs');
    }

    const newTeam = this.teamRepository.create({
      name,
      tournament,
      users,
      statusInTournament: TeamStatusTypes.not_assigned,
    });

    const savedTeam = await this.teamRepository.save(newTeam);

    return savedTeam;
  }

  async createTournamentTeams(
    createTournamentTeamsInputDto: CreateTournamentTeamsInputDto,
  ): Promise<Team[]> {
    const { tournamentId, teams } = createTournamentTeamsInputDto;

    const tournament =
      await this.tournamentManagementService.findOne(tournamentId);
    if (!tournament) {
      throw new Error(`Tournament with ID ${tournamentId} not found`);
    }

    const allUserIds = teams.reduce(
      (acc, team) => [...acc, ...team.userIds],
      [],
    );
    const uniqueUserIds = [...new Set(allUserIds)];
    const users = await this.usersService.findMultipleUsersById(uniqueUserIds);

    if (users.length !== uniqueUserIds.length) {
      const foundUserIds = users.map((user) => user.id);
      const missingUserIds = uniqueUserIds.filter(
        (id) => !foundUserIds.includes(id),
      );
      throw new Error(`Users with IDs ${missingUserIds.join(', ')} not found`);
    }

    const teamsToCreate = teams.map((teamInput) => {
      const teamUsers = users.filter((user) =>
        teamInput.userIds.includes(user.id),
      );
      return this.teamRepository.create({
        name: teamInput.name,
        tournament,
        users: teamUsers,
        statusInTournament: TeamStatusTypes.not_assigned,
      });
    });

    const savedTeams = await this.teamRepository.save(teamsToCreate);
    return savedTeams;
  }

  async deleteTeamsByTournament(tournament: Tournament) {
    await this.teamRepository.delete({ tournament: { id: tournament.id } });
  }
}
