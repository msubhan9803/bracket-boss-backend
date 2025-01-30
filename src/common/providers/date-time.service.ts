import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Day } from '../entities/day.entity';
import { TimeSlot } from '../entities/time-slot.entity';
import { DayName } from '../types/global';

@Injectable()
export class DateTimeService {
  constructor(
    @InjectRepository(Day)
    private dayRepository: Repository<Day>,
    @InjectRepository(TimeSlot)
    private timeSlotsRepository: Repository<TimeSlot>,
  ) { }

  async findOrCreateDay(dayName: DayName): Promise<Day> {
    let day = await this.dayRepository.findOne({ where: { name: dayName } });
    if (!day) {
      day = this.dayRepository.create({ name: dayName });
      await this.dayRepository.save(day);
    }
    return day;
  }

  async findOrCreateTimeSlot(startTime: string, endTime: string): Promise<TimeSlot> {
    let timeSlot = await this.timeSlotsRepository.findOne({
      where: { startTime, endTime },
    });
    if (!timeSlot) {
      timeSlot = this.timeSlotsRepository.create({ startTime, endTime });
      await this.timeSlotsRepository.save(timeSlot);
    }
    return timeSlot;
  }

  /**
   * Returns a list of all dates between the given start and end dates
   * that match the specified day name.
   * @param startDate 
   * @param endDate 
   * @param dayName - The name of the day (e.g., "Monday", "Tuesday").
   * @returns Date[]
   */
  getAllDatesForDayInRange(startDate: Date, endDate: Date, dayName: DayName): Date[] {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);

    const dayIndex = Object.values(DayName).indexOf(dayName) + 1;

    if (dayIndex === -1) {
      throw new Error("Invalid day name provided");
    }

    while (currentDate <= endDate) {
      if (currentDate.getDay() === dayIndex) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }
}
