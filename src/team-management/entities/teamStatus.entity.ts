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
import { TeamStatusTypes } from '../types/common';
import { Team } from './team.entity';

registerEnumType(TeamStatusTypes, {
  name: 'TeamStatusTypes',
});

@ObjectType()
@Entity()
export class TeamStatus {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => TeamStatusTypes)
  @Column('varchar')
  status: TeamStatusTypes;

  @Field(() => [Team])
  @ManyToMany(() => Team, (team) => team.statuses)
  teams: Team[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(teamStatus: Partial<TeamStatus>) {
    Object.assign(this, teamStatus);
  }
}
