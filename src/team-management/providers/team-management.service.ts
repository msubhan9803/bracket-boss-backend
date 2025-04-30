import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamInputDto } from '../dtos/create-team-input.dto';
import { Team } from '../entities/team.entity';
import { TournamentManagementService } from 'src/tournament-management/providers/tournament-management.service';
import { UsersService } from 'src/users/providers/users.service';
import { TeamStatusTypes } from '../types/common';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { User } from 'src/users/entities/user.entity';
import { DraftTeam } from 'src/scheduling/types/common';

@Injectable()
export class TeamManagementService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly tournamentManagementService: TournamentManagementService,
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

  async findTeamsByTournament(tournamentId: number, relations: string[] = ['users']): Promise<Team[]> {
    return this.teamRepository.find({
      where: { tournament: { id: tournamentId } },
      relations
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

  async createTeamOfTournament(tournament: Tournament, teams: DraftTeam[], users: User[]) {
    const teamsToCreate = teams.map((teamInput) => {
      return this.teamRepository.create({
        name: teamInput.name,
        tournament,
        users: teamInput.players,
        statusInTournament: TeamStatusTypes.registered,
      });
    });

    const savedTeams = await this.teamRepository.save(teamsToCreate);
    return savedTeams;
  }

  async deleteTeamsByTournament(tournament: Tournament) {
    await this.teamRepository.delete({ tournament: { id: tournament.id } });
  }
}
