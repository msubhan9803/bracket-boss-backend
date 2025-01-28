import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourtSchedule } from '../entities/court-schedule.entity';

@Injectable()
export class CourtScheduleService {
    constructor(
        @InjectRepository(CourtSchedule)
        private courtScheduleRepository: Repository<CourtSchedule>
    ) { }

    findOneByID(courtScheduleId: number) {
        return this.courtScheduleRepository.findOneBy({ id: courtScheduleId })
    }
}
