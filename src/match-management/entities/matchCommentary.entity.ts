import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Match } from './match.entity';
import { Club } from 'src/clubs/entities/club.entity';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { MatchRound } from './matchRound.entity';

@ObjectType()
@Entity()
export class MatchCommentary {
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

  @Field(() => MatchRound)
  @ManyToOne(() => MatchRound)
  @JoinColumn()
  matchRound: MatchRound;

  @Field()
  @Column()
  text: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(matchCommentary: Partial<MatchCommentary>) {
    Object.assign(this, matchCommentary);
  }
}
