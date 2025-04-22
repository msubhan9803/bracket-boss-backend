import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Sport } from 'src/sport-management/entities/sport.entity';
import { Format } from 'src/format-management/entities/format.entity';
import { TeamGenerationType } from 'src/team-generation-type-management/entities/team-generation-type.entity';
import { SplitSwitchGroupByEnum } from 'src/scheduling/types/common';
import { IsOptional } from 'class-validator';
import { TournamentStatusTypesEnum } from '../types/common';
import { Level } from 'src/level/entities/level.entity';

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
  poolPlayFormat: Format;

  @ManyToOne(() => Format)
  @JoinColumn()
  @Field(() => Format)
  playOffFormat: Format;

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
  
  @Field(() => TournamentStatusTypesEnum)
  @Column('varchar')
  status: TournamentStatusTypesEnum;

  @OneToOne(() => Sport)
  @JoinColumn()
  @Field(() => Sport)
  sport: Sport;

  @OneToMany(() => Level, level => level.tournament, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @Field(() => [Level])
  levels: Level[];

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
