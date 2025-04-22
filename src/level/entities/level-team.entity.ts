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
import { Level } from './level.entity';
import { Team } from 'src/team-management/entities/team.entity';
import { TeamStatusTypes } from 'src/team-management/types/common';

@ObjectType()
@Entity()
export class LevelTeam {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Level)
  @JoinColumn()
  @Field(() => Level)
  level: Level;

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

  constructor(levelTeam: Partial<LevelTeam>) {
    Object.assign(this, levelTeam);
  }
}
