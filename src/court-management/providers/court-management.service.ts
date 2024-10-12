import { Injectable } from '@nestjs/common';
import { Court } from '../entities/court.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourtInputDto } from '../dtos/create-court-input.dto';
import { ClubsService } from 'src/clubs/providers/clubs.service';

@Injectable()
export class CourtManagementService {
  constructor(
    @InjectRepository(Court)
    private courtRepository: Repository<Court>,
    private clubsService: ClubsService,
  ) {}

  findAll(): Promise<Court[]> {
    return this.courtRepository.find();
  }

  async findAllWithRelations(options: {
    page: number;
    pageSize: number;
    filterBy?: string;
    filter?: string;
    sort?: { field: string; direction: 'ASC' | 'DESC' };
    relations?: string[];
  }): Promise<[Court[], number]> {
    const { page, pageSize, filterBy, filter, sort } = options;

    const query = this.courtRepository
      .createQueryBuilder('court')
      .leftJoinAndSelect('court.club', 'club')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (filterBy && filter) {
      query.andWhere(`court.${filterBy} LIKE :filter`, {
        filter: `%${filter}%`,
      });
    }

    if (sort) {
      query.orderBy(`court.${sort.field}`, sort.direction);
    }

    const [courts, totalRecords] = await query.getManyAndCount();

    return [courts, totalRecords];
  }

  findOne(id: number): Promise<Court> {
    return this.courtRepository.findOneBy({ id });
  }

  findOneWithRelations(
    courtId: number,
    relations: string[] = ['club'],
  ): Promise<Court> {
    return this.courtRepository.findOne({
      where: { id: courtId },
      relations,
    });
  }

  async createCourt(createCourtDto: CreateCourtInputDto): Promise<Court> {
    const club = await this.clubsService.findOne(createCourtDto.clubId);

    const newCourt = this.courtRepository.create({
      name: createCourtDto.name,
      location: createCourtDto.location,
      club,
    });

    return this.courtRepository.save(newCourt);
  }
}
