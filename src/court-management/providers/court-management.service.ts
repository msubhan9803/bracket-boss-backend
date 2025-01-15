import { Injectable } from '@nestjs/common';
import { Court } from '../entities/court.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourtInputDto } from '../dtos/create-court-input.dto';
import { ClubsService } from 'src/clubs/providers/clubs.service';
import { UpdateCourtInputDto } from '../dtos/update-court-input.dto';
import { CourtSchedule } from '../entities/court-schedule.entity';
import { DateTimeService } from 'src/common/providers/date-time.service';

@Injectable()
export class CourtManagementService {
  constructor(
    @InjectRepository(Court)
    private courtRepository: Repository<Court>,
    @InjectRepository(CourtSchedule)
    private courtScheduleRepository: Repository<CourtSchedule>,
    private clubsService: ClubsService,
    private dateTimeService: DateTimeService,
  ) { }

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
    clubId: number;
  }): Promise<[Court[], number]> {
    const { page, pageSize, filterBy, filter, sort } = options;

    const query = this.courtRepository
      .createQueryBuilder('court')
      .leftJoinAndSelect('court.club', 'club')
      .leftJoinAndSelect('court.courtSchedules', 'courtSchedules')
      .leftJoinAndSelect('courtSchedules.day', 'day')
      .leftJoinAndSelect('courtSchedules.timeSlot', 'timeSlot')
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

  async updateCourt(updateCourtInputDto: UpdateCourtInputDto): Promise<Court> {
    await this.courtRepository.update(updateCourtInputDto.courtId, {
      name: updateCourtInputDto.name,
      location: updateCourtInputDto.location,
      courtLength: updateCourtInputDto.courtLength,
      courtWidth: updateCourtInputDto.courtWidth,
    });
  
    const court = await this.courtRepository.findOne({
      where: { id: updateCourtInputDto.courtId },
      relations: ['club', 'courtSchedules', 'courtSchedules.timeSlot', 'courtSchedules.day'],
    });
  
    if (updateCourtInputDto.dailySchedule) {
      const updatedScheduleIds: number[] = [];
  
      for (const dailySchedule of updateCourtInputDto.dailySchedule) {
        const day = await this.dateTimeService.findOrCreateDay(dailySchedule.day);
  
        for (const scheduleTiming of dailySchedule.scheduleTimings) {
          if (scheduleTiming.id) {
            const existingCourtSchedule = await this.courtScheduleRepository.findOne({
              where: { id: scheduleTiming.id as number },
              relations: ['timeSlot'],
            });
  
            if (existingCourtSchedule) {
              const updatedTimeSlot = await this.dateTimeService.findOrCreateTimeSlot(
                scheduleTiming.startTime,
                scheduleTiming.endTime,
              );
  
              existingCourtSchedule.timeSlot = updatedTimeSlot;
              await this.courtScheduleRepository.save(existingCourtSchedule);
              updatedScheduleIds.push(existingCourtSchedule.id);
            }
          } else {
            const newTimeSlot = await this.dateTimeService.findOrCreateTimeSlot(
              scheduleTiming.startTime,
              scheduleTiming.endTime,
            );
  
            const newCourtSchedule = this.courtScheduleRepository.create({
              court,
              day,
              timeSlot: newTimeSlot,
            });
  
            const savedSchedule = await this.courtScheduleRepository.save(newCourtSchedule);
            updatedScheduleIds.push(savedSchedule.id);
          }
        }
      }
  
      const schedulesToDelete = court.courtSchedules.filter(
        (schedule) => !updatedScheduleIds.includes(schedule.id),
      );
  
      for (const schedule of schedulesToDelete) {
        await this.courtScheduleRepository.delete(schedule.id);
      }
    }
  
    return court;
  }
  
}
