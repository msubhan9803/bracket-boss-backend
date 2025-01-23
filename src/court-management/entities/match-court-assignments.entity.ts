import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Column,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Court } from 'src/court-management/entities/court.entity';
import { CourtSchedule } from 'src/court-management/entities/court-schedule.entity';
import { Match } from 'src/match-management/entities/match.entity';

@ObjectType()
@Entity()
export class MatchCourtAssignments {
    @Field(() => Number)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => Court)
    @ManyToOne(() => Court)
    @JoinColumn({ name: 'courtId' })
    court: Court;

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
    actualDate: Date;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    constructor(matchCourtAssignment: Partial<MatchCourtAssignments>) {
        Object.assign(this, matchCourtAssignment);
    }
}