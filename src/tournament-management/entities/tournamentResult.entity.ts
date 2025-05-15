import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Tournament } from './tournament.entity';
import { TournamentWinner } from './tournamentWinner.entity';

@ObjectType()
@Entity()
export class TournamentResult {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Tournament)
  @JoinColumn()
  @Field(() => Tournament)
  tournament: Tournament;

  @OneToMany(() => TournamentWinner, (winner) => winner.tournamentResult, {
    cascade: true,
  })
  @JoinColumn()
  @Field(() => [TournamentWinner])
  winners: TournamentWinner[];

  @Field()
  @CreateDateColumn()
  created_at: Date = new Date();

  @Field()
  @UpdateDateColumn()
  updated_at: Date = new Date();

  constructor(tournamentResult: Partial<TournamentResult>) {
    Object.assign(this, tournamentResult);
  }
}
