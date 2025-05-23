import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Column,
    OneToOne,
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

    @OneToOne(() => Match, (match) => match.matchCourtSchedule, { onDelete: "CASCADE" })
    @JoinColumn()
    @Field(() => Match)
    match: Match;

    @ManyToOne(() => CourtSchedule)
    @JoinColumn()
    @Field(() => CourtSchedule)
    courtSchedule: CourtSchedule;

    @Field()
    @CreateDateColumn()
    matchDate: Date;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    constructor(matchCourtAssignment: Partial<MatchCourtSchedules>) {
        Object.assign(this, matchCourtAssignment);
    }
}
