import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Court } from './court.entity';
import { Day } from 'src/common/entities/day.entity';
import { TimeSlots } from 'src/common/entities/time.entity';

@ObjectType()
@Entity()
export class CourtSchedule {
    @Field(() => Number)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => Court)
    @ManyToOne(() => Court, (court) => court.courtSchedules)
    @JoinColumn({ name: 'courtId' })
    court: Court;

    @Field(() => Day)
    @ManyToOne(() => Day)
    @JoinColumn({ name: 'dayId' })
    day: Day;

    @Field(() => TimeSlots)
    @ManyToOne(() => TimeSlots)
    @JoinColumn({ name: 'timeSlotId' })
    timeSlot: TimeSlots;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    constructor(courtSchedule: Partial<CourtSchedule>) {
        Object.assign(this, courtSchedule);
    }
}