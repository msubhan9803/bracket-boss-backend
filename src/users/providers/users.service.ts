import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import messages from 'src/utils/messages';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(userRole?: number): Promise<User[]> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.clubs', 'clubs')
      .leftJoinAndSelect('user.steps', 'steps')
      .leftJoinAndSelect('user.userRoleClub', 'userRoleClub')
      .leftJoinAndSelect('userRoleClub.role', 'role')
      .leftJoinAndSelect('user.teamsTournamentsUsers', 'teamsTournamentsUsers');

    if (userRole) {
      query.where('role.id = :userRole', { userRole });
    }

    const users = await query.getMany();

    return users;
  }

  async findAllWithRelations(options: {
    userRole: number;
    page: number;
    pageSize: number;
    filterBy?: string;
    filter?: string;
    sort?: { field: string; direction: 'ASC' | 'DESC' };
    relations?: string[];
  }): Promise<[User[], number]> {
    const { page, pageSize, filterBy, filter, sort, userRole } = options;

    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.clubs', 'clubs')
      .leftJoinAndSelect('user.steps', 'steps')
      .leftJoinAndSelect('user.userRoleClub', 'userRoleClub')
      .leftJoinAndSelect('userRoleClub.role', 'role')
      .leftJoinAndSelect('user.teamsTournamentsUsers', 'teamsTournamentsUsers')
      .where('userRoleClub.role.id = :userRole', { userRole })
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (filterBy && filter) {
      query.andWhere(`user.${filterBy} LIKE :filter`, {
        filter: `%${filter}%`,
      });
    }

    if (sort) {
      query.orderBy(`user.${sort.field}`, sort.direction);
    }

    const [users, totalRecords] = await query.getManyAndCount();

    return [users, totalRecords];
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  findMultipleUsersById(ids: number[]): Promise<User[]> {
    return this.userRepository.findBy({ id: In(ids) });
  }

  findOneWithRelations(userId: number, relations: string[]): Promise<User> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations,
    });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  findOneByEmailWithRelations(
    email: string,
    relations: string[],
  ): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      relations,
    });
  }

  async create(createUserInput: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

    const newUser = this.userRepository.create({
      ...createUserInput,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async update(id: number, updateUserInput: Partial<User>): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserInput,
    });
    if (!user) {
      throw new Error(messages.USER_NOT_FOUND);
    }
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
