import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Round } from './round.entity';
import { Team } from 'src/team-management/entities/team.entity';
import { TeamStatusTypes } from 'src/team-management/types/common';

@ObjectType()
@Entity()
export class RoundTeam {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Round)
  @JoinColumn()
  @Field(() => Round)
  round: Round;

  @ManyToOne(() => Team)
  @JoinColumn()
  @Field(() => Team)
  team: Team;

  @Field(() => TeamStatusTypes)
  @Column('varchar')
  status: TeamStatusTypes;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(roundTeam: Partial<RoundTeam>) {
    Object.assign(this, roundTeam);
  }
}
