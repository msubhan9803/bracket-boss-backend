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
import { TournamentRoundStatusTypes } from '../types/common';
import { TournamentRound } from './tournamentRound.entity';

registerEnumType(TournamentRoundStatusTypes, {
  name: 'TournamentRoundStatusTypes',
});

@ObjectType()
@Entity()
export class TournamentRoundStatus {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => TournamentRoundStatusTypes)
  @Column('varchar')
  status: TournamentRoundStatusTypes;

  @Field(() => [TournamentRound])
  @ManyToMany(
    () => TournamentRound,
    (tournamentRound) => tournamentRound.statuses,
  )
  tournamentRounds: TournamentRound[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(tournamentRoundStatus: Partial<TournamentRoundStatus>) {
    Object.assign(this, tournamentRoundStatus);
  }
}
