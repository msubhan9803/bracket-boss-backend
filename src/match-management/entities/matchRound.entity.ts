import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Club } from 'src/clubs/entities/club.entity';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { Match } from './match.entity';
import { Team } from 'src/team-management/entities/team.entity';
import { MatchRoundStatus } from './matchRoundStatus.entity';

@ObjectType()
@Entity()
export class MatchRound {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Club)
  @ManyToOne(() => Club)
  @JoinColumn()
  club: Club;

  @Field(() => Tournament)
  @ManyToOne(() => Tournament)
  @JoinColumn()
  tournament: Tournament;

  @Field(() => Match)
  @ManyToOne(() => Match)
  @JoinColumn()
  match: Match;

  @Field()
  @CreateDateColumn()
  startTime: Date;

  @Field()
  @CreateDateColumn()
  endTime: Date;

  @Field()
  @Column('int')
  matchRoundNumber: number;

  @Field(() => Team, { nullable: true })
  @ManyToOne(() => Team, { nullable: true })
  @JoinColumn()
  winnerTeam?: Team;

  @Field(() => [MatchRoundStatus])
  @ManyToMany(() => MatchRoundStatus, (matchStatus) => matchStatus.matchRounds)
  @JoinTable({ name: 'match_round_match_round_statuses' })
  statuses: MatchRoundStatus[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(matchRound: Partial<MatchRound>) {
    Object.assign(this, matchRound);
  }
}
