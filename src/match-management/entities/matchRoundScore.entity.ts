import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { MatchRound } from './matchRound.entity';

@ObjectType()
@Entity()
export class MatchRoundScore {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => MatchRound, (matchRound) => matchRound.matchRoundScore)
  @Field(() => MatchRound)
  matchRound: MatchRound;

  @Field()
  @Column('int')
  homeTeamScore: number;

  @Field()
  @Column('int')
  awayTeamScore: number;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(matchRoundScore: Partial<MatchRoundScore>) {
    Object.assign(this, matchRoundScore);
  }
}
