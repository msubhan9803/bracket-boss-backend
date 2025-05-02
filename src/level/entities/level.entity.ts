import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Format } from 'src/format-management/entities/format.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LevelTypeEnum } from '../types/common';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Pool } from 'src/pool/entities/pool.entity';
import { Match } from 'src/match-management/entities/match.entity';

registerEnumType(LevelTypeEnum, {
  name: 'LevelTypeEnum',
});

@ObjectType()
@Entity()
export class Level {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => LevelTypeEnum)
  @Column('varchar')
  type: LevelTypeEnum;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column('int')
  order: number;

  @OneToOne(() => Format)
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
