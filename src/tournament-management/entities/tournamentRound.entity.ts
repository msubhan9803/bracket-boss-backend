import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Tournament } from './tournament.entity';
import { Format } from 'src/format-management/entities/format.entity';
import { Club } from 'src/clubs/entities/club.entity';
import { TournamentRoundStatus } from './tournamentRoundStatus.entity';
import { Match } from 'src/match-management/entities/match.entity';

@ObjectType()
@Entity()
export class TournamentRound {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Club)
  @ManyToOne(() => Club)
  @JoinColumn()
  club: Club;

  @ManyToOne(() => Tournament, (tournament) => tournament.tournamentRounds)
  @JoinColumn()
  @Field(() => Tournament)
  tournament: Tournament;

  @Field(() => [Match])
  @OneToMany(() => Match, (match) => match.tournamentRound)
  matches: Match[];

  @Field()
  @Column('int')
  roundNumber: number;

  @ManyToOne(() => Format)
  @JoinColumn()
  @Field(() => Format)
  roundFormat: Format;

  @Field(() => [TournamentRoundStatus])
  @ManyToMany(
    () => TournamentRoundStatus,
    (tournamentRoundStatus) => tournamentRoundStatus.tournamentRounds,
  )
  @JoinTable({ name: 'tournament_round_tournament_round_statuses' })
  statuses: TournamentRoundStatus[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(tournament: Partial<TournamentRound>) {
    Object.assign(this, tournament);
  }
}
