import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Club } from 'src/clubs/entities/club.entity';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Sport } from 'src/sport-management/entities/sport.entity';
import { Format } from 'src/format-management/entities/format.entity';
import { TeamGenerationType } from 'src/team-generation-type-management/entities/team-generation-type.entity';
import { GroupByEnum } from 'src/scheduling/types/common';
import { IsOptional } from 'class-validator';
import { TournamentStatus } from './tournamentStatus.entity';
import { TournamentRound } from './tournamentRound.entity';

registerEnumType(GroupByEnum, {
  name: 'GroupByEnum',
});

@ObjectType()
@Entity()
export class Tournament {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Club)
  @JoinColumn()
  @Field(() => Club)
  club: Club;

  @ManyToOne(() => Sport)
  @JoinColumn()
  @Field(() => Sport)
  sport: Sport;

  @Field()
  @Column('varchar')
  name: string;

  @Field()
  @Column('text')
  description: string;

  @Field()
  @CreateDateColumn()
  start_date: Date;

  @Field()
  @CreateDateColumn()
  end_date: Date;

  @Field()
  @Column('boolean')
  isPrivate: boolean;

  @ManyToOne(() => Format)
  @JoinColumn()
  @Field(() => Format)
  format: Format;

  @ManyToOne(() => TeamGenerationType)
  @JoinColumn()
  @Field(() => TeamGenerationType)
  teamGenerationType: TeamGenerationType;

  @Field(() => GroupByEnum, { nullable: true })
  @IsOptional()
  @Column('varchar', { nullable: true })
  splitSwitchGroupBy: GroupByEnum;

  @ManyToOne(() => Format)
  @JoinColumn()
  @Field(() => Format)
  playOffMatchesType: Format;

  @Field()
  @Column('int')
  bestOfRounds: number;

  @Field(() => [TournamentStatus])
  @ManyToMany(
    () => TournamentStatus,
    (tournamentStatus) => tournamentStatus.tournaments,
  )
  @JoinTable({ name: 'tournament_tournament_statuses' })
  statuses: TournamentStatus[];

  @OneToMany(() => TournamentRound, (tournamentRound) => tournamentRound.tournament)
  @Field(() => [TournamentRound])
  tournamentRounds: TournamentRound[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(tournament: Partial<Tournament>) {
    Object.assign(this, tournament);
  }
}
