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
import { TournamentStatusTypes } from '../types/common';
import { Tournament } from './tournament.entity';

registerEnumType(TournamentStatusTypes, {
  name: 'TournamentStatusTypes',
});

@ObjectType()
@Entity()
export class TournamentStatus {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => TournamentStatusTypes)
  @Column('varchar')
  status: TournamentStatusTypes;

  @Field(() => [Tournament])
  @ManyToMany(() => Tournament, (tournament) => tournament.statuses)
  tournaments: Tournament[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(tournament: Partial<TournamentStatus>) {
    Object.assign(this, tournament);
  }
}
