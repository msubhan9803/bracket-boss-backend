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
import { MatchStatusTypes } from '../types/common';
import { Match } from './match.entity';

registerEnumType(MatchStatusTypes, {
  name: 'MatchStatusTypes',
});

@ObjectType()
@Entity()
export class MatchStatus {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => MatchStatusTypes)
  @Column('varchar')
  status: MatchStatusTypes;

  @Field(() => [Match])
  @ManyToMany(() => Match, (match) => match.statuses, {
    cascade: true,
  })
  matches: Match[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(matchStatus: Partial<MatchStatus>) {
    Object.assign(this, matchStatus);
  }
}
