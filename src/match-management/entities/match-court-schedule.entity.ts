import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Column,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CourtSchedule } from 'src/court-management/entities/court-schedule.entity';
import { Match } from 'src/match-management/entities/match.entity';

@ObjectType()
@Entity()
export class MatchCourtSchedules {
    @Field(() => Number)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => Match)
    @ManyToOne(() => Match)
    @JoinColumn({ name: 'matchId' })
    match: Match;

    @Field(() => CourtSchedule)
    @ManyToOne(() => CourtSchedule)
    @JoinColumn({ name: 'courtScheduleId' })
    courtSchedule: CourtSchedule;

    @Field()
    @Column('date')
    matchDate: Date;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    constructor(matchCourtAssignment: Partial<MatchCourtSchedules>) {
        Object.assign(this, matchCourtAssignment);
    }
}