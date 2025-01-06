import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Day } from './entities/day.entity';
import { TimeSlots } from './entities/time.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Day, TimeSlots])],
    exports: [TypeOrmModule],
})
export class CommonModule { }
