import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { MatchRoundStatusTypes } from '../types/common';
import { MatchRound } from './matchRound.entity';

registerEnumType(MatchRoundStatusTypes, {
  name: 'MatchRoundStatusTypes',
});

@ObjectType()
@Entity()
export class MatchRoundStatus {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => MatchRoundStatusTypes)
  @Column('varchar')
  status: MatchRoundStatusTypes;

  @Field(() => [MatchRound])
  @ManyToMany(() => MatchRound, (matchRound) => matchRound.statuses)
  matchRounds: MatchRound[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(matchRoundStatus: Partial<MatchRoundStatus>) {
    Object.assign(this, matchRoundStatus);
  }
}
