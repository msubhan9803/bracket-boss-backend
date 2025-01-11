import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Day } from '../entities/day.entity';
import { TimeSlots } from '../entities/time.entity';
import { DayName } from '../types/global';

@Injectable()
export class DateTimeService {
  constructor(
    @InjectRepository(Day)
    private dayRepository: Repository<Day>,
    @InjectRepository(TimeSlots)
    private timeSlotsRepository: Repository<TimeSlots>,
  ) {}

  async findOrCreateDay(dayName: DayName): Promise<Day> {
    let day = await this.dayRepository.findOne({ where: { name: dayName } });
    if (!day) {
      day = this.dayRepository.create({ name: dayName });
      await this.dayRepository.save(day);
    }
    return day;
  }

  async findOrCreateTimeSlot(startTime: string, endTime: string): Promise<TimeSlots> {
    let timeSlot = await this.timeSlotsRepository.findOne({
      where: { startTime, endTime },
    });
    if (!timeSlot) {
      timeSlot = this.timeSlotsRepository.create({ startTime, endTime });
      await this.timeSlotsRepository.save(timeSlot);
    }
    return timeSlot;
  }
}