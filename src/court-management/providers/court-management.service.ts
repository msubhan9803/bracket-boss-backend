import { Injectable } from '@nestjs/common';
import { Court } from '../entities/court.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourtInputDto } from '../dtos/create-court-input.dto';
import { ClubsService } from 'src/clubs/providers/clubs.service';
import { UpdateCourtInputDto } from '../dtos/update-court-input.dto';
import { CourtSchedule } from '../entities/court-schedule.entity';
import { DateTimeService } from 'src/common/providers/date-time.service';
import { UpsertCourtInputDto } from '../dtos/upsert-court-input.dto';

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

  async upsertCourt(upsertCourtInputDto: UpsertCourtInputDto): Promise<Court> {
    let court: Court;

    if (upsertCourtInputDto.courtId) {
      // Update existing court
      await this.courtRepository.update(upsertCourtInputDto.courtId, {
        name: upsertCourtInputDto.name,
        location: upsertCourtInputDto.location,
        courtLength: upsertCourtInputDto.courtLength,
        courtWidth: upsertCourtInputDto.courtWidth,
      });

      court = await this.courtRepository.findOne({
        where: { id: upsertCourtInputDto.courtId },
        relations: ['club', 'courtSchedules', 'courtSchedules.timeSlot', 'courtSchedules.day'],
      });

      if (!court) {
        throw new Error('Court not found for update');
      }
    } else {
      // Create new court
      const club = await this.clubsService.findOne(upsertCourtInputDto.clubId);

      court = this.courtRepository.create({
        name: upsertCourtInputDto.name,
        location: upsertCourtInputDto.location,
        club,
        courtLength: upsertCourtInputDto.courtLength,
        courtWidth: upsertCourtInputDto.courtWidth,
      });

      court = await this.courtRepository.save(court);
    }

    if (upsertCourtInputDto.dailySchedule) {
      const updatedScheduleIds: number[] = [];

      for (const dailySchedule of upsertCourtInputDto.dailySchedule) {
        const day = await this.dateTimeService.findOrCreateDay(dailySchedule.day);

        for (const scheduleTiming of dailySchedule.scheduleTimings) {
          if (scheduleTiming.id) {
            const existingCourtSchedule = await this.courtScheduleRepository.findOne({
              where: { id: scheduleTiming.id },
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

      if (court.courtSchedules) {
        const schedulesToDelete = court.courtSchedules.filter(
          (schedule) => !updatedScheduleIds.includes(schedule.id),
        );

        for (const schedule of schedulesToDelete) {
          await this.courtScheduleRepository.delete(schedule.id);
        }
      }
    }

    return court;
  }

  /**
   * [x] We will provide start and end date
   * [x] It'll fetch all of the courts with their schedules
   * 
   * In our system, courts have generic weekly schedule so we get monday, tuesday et...
   * along with timings for each generic day
   * We need to somehow map start/end date for each generic day and filter out the courts
   * 
   * 🔥 Tasks:
   *  - For each fetched court, create schedule for dates within start/end date
   *  - Check if Court has already assigned for given date schedule of the tournament
   *    then remove that timeslot & if fully booked then remove the court
   * @param startDate 
   * @param endDate 
   * @returns 
   */
  async getCourtsWithSchedule(startDate?: Date, endDate?: Date): Promise<Court[]> {
    const query = this.courtRepository
      .createQueryBuilder('court')
      .leftJoinAndSelect('court.courtSchedules', 'courtSchedules')
      .leftJoinAndSelect('courtSchedules.day', 'day')
      .leftJoinAndSelect('courtSchedules.timeSlot', 'timeSlot');

    const courts = await query.getMany();

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      courts.forEach(court => {
        court.courtSchedules = court.courtSchedules.filter(schedule => {
          const scheduleDate = new Date(schedule.day.name);
          return scheduleDate >= start && scheduleDate <= end;
        });
      });
    }

    return courts;
  }
}
