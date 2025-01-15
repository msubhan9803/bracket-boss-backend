import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class TimeSlot {
    @Field(() => Number)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column('time')
    startTime: string;

    @Field()
    @Column('time')
    endTime: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    constructor(timeSlot: Partial<TimeSlot>) {
        Object.assign(this, timeSlot);
    }
}