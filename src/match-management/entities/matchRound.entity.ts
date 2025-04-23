import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Match } from './match.entity';

@ObjectType()
@Entity()
export class MatchRound {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Match)
  @ManyToOne(() => Match, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  match: Match;

  @Field()
  @Column('int')
  matchRoundNumber: number;

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
