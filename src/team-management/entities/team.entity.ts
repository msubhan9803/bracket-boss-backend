import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Club } from 'src/clubs/entities/club.entity';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { TeamsTournamentsUsers } from './teams-tournaments-users.entity';

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

  @Field(() => [TeamsTournamentsUsers], { nullable: true })
  @OneToMany(() => TeamsTournamentsUsers, (ttu) => ttu.team)
  teamsTournamentsUsers: TeamsTournamentsUsers[];

  @Field()
  @CreateDateColumn()
  createdDate: Date;

  @Field()
  @UpdateDateColumn()
  updatedDate: Date;

  constructor(club: Partial<Club>) {
    Object.assign(this, club);
  }
}
