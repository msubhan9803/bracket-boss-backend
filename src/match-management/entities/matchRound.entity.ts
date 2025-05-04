import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Match } from './match.entity';
import { MatchRoundStatusTypes } from '../types/common';
import { MatchRoundScore } from './matchRoundScore.entity';

registerEnumType(MatchRoundStatusTypes, {
  name: 'MatchRoundStatusTypes',
});

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

  @Field(() => MatchRoundStatusTypes)
  @Column('varchar')
  status: MatchRoundStatusTypes;

  @OneToOne(() => MatchRoundScore, (matchRoundScore) => matchRoundScore.matchRound, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true
  })
  @JoinColumn()
  @Field(() => MatchRoundScore, { nullable: true })
  matchRoundScore?: MatchRoundScore;

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
