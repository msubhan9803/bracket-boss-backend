import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Sport } from 'src/sport-management/entities/sport.entity';
import { TeamGenerationType } from 'src/team-generation-type-management/entities/team-generation-type.entity';
import { SplitSwitchGroupByEnum } from 'src/scheduling/types/common';
import { IsOptional } from 'class-validator';
import { TournamentStatusTypesEnum } from '../types/common';
import { Level } from 'src/level/entities/level.entity';
import { Round } from 'src/round/entities/round.entity';
import { TournamentResult } from './tournamentResult.entity';
import { Team } from 'src/team-management/entities/team.entity';
import { Match } from 'src/match-management/entities/match.entity';

registerEnumType(SplitSwitchGroupByEnum, {
  name: 'SplitSwitchGroupByEnum',
});

registerEnumType(TournamentStatusTypesEnum, {
  name: 'TournamentStatusTypesEnum',
});

@ObjectType()
@Entity()
export class Tournament {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column('text')
  slug: string;

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

  @ManyToOne(() => TeamGenerationType)
  @JoinColumn()
  @Field(() => TeamGenerationType)
  teamGenerationType: TeamGenerationType;

  @Field(() => SplitSwitchGroupByEnum, { nullable: true })
  @IsOptional()
  @Column('varchar', { nullable: true })
  splitSwitchGroupBy: SplitSwitchGroupByEnum;

  @Field()
  @Column('int')
  matchBestOfRounds: number;

  @Field()
  @Column('int')
  numberOfPools: number;
  
  @Field(() => TournamentStatusTypesEnum)
  @Column('varchar')
  status: TournamentStatusTypesEnum;

  @ManyToOne(() => Sport)
  @JoinColumn()
  @Field(() => Sport)
  sport: Sport;

  @OneToMany(() => Level, level => level.tournament, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @Field(() => [Level])
  levels: Level[];

  @OneToMany(() => Round, round => round.tournament, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @Field(() => [Round], { nullable: true })
  rounds: Round[];

  @OneToMany(() => Match, match => match.tournament, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @Field(() => [Match])
  matches: Match[];

  @OneToOne(() => TournamentResult, (result) => result.tournament)
  @Field(() => TournamentResult, { nullable: true })
  tournamentResult: TournamentResult;

  @OneToMany(() => Team, team => team.tournament, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @Field(() => [Team])
  teams: Team[];

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
