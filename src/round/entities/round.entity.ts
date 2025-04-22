import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Pool } from 'src/pool/entities/pool.entity';

@ObjectType()
@Entity()
export class Round {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  name: string;

  @ManyToOne(() => Tournament, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  @Field(() => Tournament)
  tournament: Tournament;

  @ManyToOne(() => Pool, pool => pool.rounds, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  @Field(() => Pool)
  pool: Pool;

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
