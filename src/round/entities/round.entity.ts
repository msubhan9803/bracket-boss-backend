import { Field, ObjectType } from '@nestjs/graphql';
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
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Pool } from 'src/pool/entities/pool.entity';
import { Match } from 'src/match-management/entities/match.entity';

@ObjectType()
@Entity()
export class Round {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column('int')
  order: number;

  @ManyToOne(() => Tournament, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Field(() => Tournament)
  tournament: Tournament;

  @ManyToOne(() => Pool, (pool) => pool.rounds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Field(() => Pool)
  pool: Pool;

  @OneToMany(() => Match, (match) => match.round, {
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

  constructor(round: Partial<Round>) {
    Object.assign(this, round);
  }
}
