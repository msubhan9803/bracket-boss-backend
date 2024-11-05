import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Club } from 'src/clubs/entities/club.entity';
import { MatchStatusTypes } from '../types/common';
import { Match } from './match.entity';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';

registerEnumType(MatchStatusTypes, {
  name: 'MatchStatusTypes',
});

@ObjectType()
@Entity()
export class MatchStatus {
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

  @Field(() => MatchStatusTypes)
  @Column('varchar')
  status: MatchStatusTypes;

  @Field(() => [Match])
  @ManyToMany(() => Match, (match) => match.statuses)
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
