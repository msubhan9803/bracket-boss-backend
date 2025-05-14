import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Tournament } from './tournament.entity';
import { Team } from 'src/team-management/entities/team.entity';
import { TournamentResult } from './tournamentResult.entity';

@ObjectType()
@Entity()
export class TournamentWinner {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tournament)
  @JoinColumn()
  @Field(() => Tournament)
  tournament: Tournament;

  @ManyToOne(() => TournamentResult)
  @Field(() => TournamentResult)
  tournamentResult: TournamentResult;

  @ManyToOne(() => Team)
  @JoinColumn()
  @Field(() => Team)
  team: Team;

  @Field()
  @Column('int')
  rank: number;

  @Field()
  @CreateDateColumn()
  created_at: Date = new Date();

  @Field()
  @UpdateDateColumn()
  updated_at: Date = new Date();

  constructor(tournamentWinner: Partial<TournamentWinner>) {
    Object.assign(this, tournamentWinner);
  }
}
