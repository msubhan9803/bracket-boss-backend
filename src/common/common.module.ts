import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Day } from './entities/day.entity';
import { TimeSlots } from './entities/time.entity';
import { DateTimeService } from './providers/date-time.service';

@Module({
    imports: [TypeOrmModule.forFeature([Day, TimeSlots])],
    providers: [DateTimeService],
    exports: [TypeOrmModule, DateTimeService],
})
export class CommonModule { }
