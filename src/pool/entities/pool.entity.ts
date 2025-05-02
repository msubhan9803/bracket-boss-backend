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
import { Level } from 'src/level/entities/level.entity';
import { Round } from 'src/round/entities/round.entity';
import { Match } from 'src/match-management/entities/match.entity';

@ObjectType()
@Entity()
export class Pool {
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

  @ManyToOne(() => Level, (level) => level.pools, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Field(() => Level)
  level: Level;

  @OneToMany(() => Round, (round) => round.pool, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Round])
  rounds: Round[];

  @OneToMany(() => Match, (match) => match.pool, {
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

  constructor(pool: Partial<Pool>) {
    Object.assign(this, pool);
  }
}
