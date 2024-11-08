import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Club } from 'src/clubs/entities/club.entity';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { User } from 'src/users/entities/user.entity';
import { TeamStatus } from './teamStatus.entity';

@ObjectType()
@Entity()
export class Team {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  name: string;

  @ManyToOne(() => Club)
  @JoinColumn()
  @Field(() => Club)
  club: Club;

  @ManyToOne(() => Tournament)
  @JoinColumn()
  @Field(() => Tournament)
  tournament: Tournament;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.teams)
  @JoinTable({ name: 'team_users' })
  users: User[];

  @Field(() => [TeamStatus])
  @ManyToMany(() => TeamStatus, (teamStatus) => teamStatus.teams)
  @JoinTable({ name: 'team_team_statuses' })
  statuses: TeamStatus[];

  @Field()
  @CreateDateColumn()
  createdDate: Date;

  @Field()
  @UpdateDateColumn()
  updatedDate: Date;

  constructor(team: Partial<Team>) {
    Object.assign(this, team);
  }
}
