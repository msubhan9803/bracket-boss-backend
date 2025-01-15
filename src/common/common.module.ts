import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Day } from './entities/day.entity';
import { TimeSlot } from './entities/time-slot.entity';
import { DateTimeService } from './providers/date-time.service';

@Module({
    imports: [TypeOrmModule.forFeature([Day, TimeSlot])],
    providers: [DateTimeService],
    exports: [TypeOrmModule, DateTimeService],
})
export class CommonModule { }
