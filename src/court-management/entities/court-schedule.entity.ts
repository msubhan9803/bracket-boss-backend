import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Court } from './court.entity';
import { Day } from 'src/common/entities/day.entity';
import { TimeSlot } from 'src/common/entities/time-slot.entity';
import { Match } from 'src/match-management/entities/match.entity';

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

    @Field(() => [Match])
    @ManyToMany(() => Match, (match) => match.courtSchedules)
    matches: Match[];

    @Field(() => Day)
    @ManyToOne(() => Day)
    @JoinColumn({ name: 'dayId' })
    day: Day;

    @Field(() => TimeSlot)
    @ManyToOne(() => TimeSlot)
    @JoinColumn({ name: 'timeSlotId' })
    timeSlot: TimeSlot;

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