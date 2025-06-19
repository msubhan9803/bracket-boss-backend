import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Format } from 'src/format-management/entities/format.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LevelStatusTypesEnum } from '../types/common';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Pool } from 'src/pool/entities/pool.entity';
import { Match } from 'src/match-management/entities/match.entity';
import { LevelTeamStanding } from './level-team-standing.entity';

registerEnumType(LevelStatusTypesEnum, {
  name: 'LevelStatusTypesEnum',
});

@ObjectType()
@Entity()
export class Level {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column('int')
  order: number;

  @Field(() => LevelStatusTypesEnum)
  @Column('varchar')
  status: LevelStatusTypesEnum;

  @ManyToOne(() => Format)
  @JoinColumn()
  @Field(() => Format)
  format: Format;

  @ManyToOne(() => Tournament, (tournament) => tournament.levels, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Field(() => Tournament)
  tournament: Tournament;

  @OneToMany(() => Pool, (pool) => pool.level, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Pool])
  pools: Pool[];

  @OneToMany(() => Match, (match) => match.level, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Match])
  @JoinColumn()
  matches: Match[];

  @OneToMany(() => LevelTeamStanding, (levelTeamStanding) => levelTeamStanding.level)
  @JoinColumn()
  @Field(() => [LevelTeamStanding])
  levelTeamStandings: LevelTeamStanding[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(level: Partial<Level>) {
    Object.assign(this, level);
  }
}
