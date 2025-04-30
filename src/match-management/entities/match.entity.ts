import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Column,
  OneToOne,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { Team } from 'src/team-management/entities/team.entity';
import { MatchRound } from './matchRound.entity';
import { Round } from 'src/round/entities/round.entity';
import { MatchStatusTypes } from '../types/common';
import { MatchCourtSchedules } from './match-court-schedule.entity';

registerEnumType(MatchStatusTypes, {
  name: 'MatchStatusTypes',
});

@ObjectType()
@Entity()
export class Match {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Tournament)
  @ManyToOne(() => Tournament)
  @JoinColumn()
  tournament: Tournament;

  @ManyToOne(() => Round, (round) => round.matches, {
    onDelete: 'CASCADE',
  })
  @Field(() => Round)
  @JoinColumn()
  round: Round;

  @Field()
  @Column('text')
  title: string;

  @Field(() => Team)
  @ManyToOne(() => Team)
  @JoinColumn()
  homeTeam: Team;

  @Field(() => Team)
  @ManyToOne(() => Team)
  @JoinColumn()
  awayTeam: Team;

  @Field(() => Team, { nullable: true })
  @ManyToOne(() => Team, { nullable: true })
  @JoinColumn()
  winnerTeam?: Team;

  @Field(() => MatchStatusTypes)
  @Column('varchar')
  status: MatchStatusTypes;

  @Field(() => [MatchRound])
  @OneToMany(() => MatchRound, (matchRound) => matchRound.match, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  matchRounds: MatchRound[];

  @Field(() => MatchCourtSchedules, { nullable: true })
  @OneToOne(() => MatchCourtSchedules, (mcs) => mcs.match, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  matchCourtSchedule?: MatchCourtSchedules;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(match: Partial<Match>) {
    Object.assign(this, match);
  }
}
