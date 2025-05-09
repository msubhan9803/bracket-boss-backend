import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Level } from './level.entity';
import { Team } from 'src/team-management/entities/team.entity';

@ObjectType()
@Entity()
export class LevelTeamStanding {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Level, (level) => level.levelTeamStandings)
  @JoinColumn()
  @Field(() => Level)
  level: Level;

  @OneToOne(() => Team)
  @JoinColumn()
  @Field(() => Team)
  team: Team;

  @Field()
  @Column('int')
  wins: number;

  @Field()
  @Column('int')
  losses: number;

  @Field()
  @Column('int')
  pointsScored: number;

  @Field()
  @Column('int')
  pointsAgainst: number;

  @Field()
  @Column('decimal')
  pointsScoredByNumberOfGames: number;

  @Field()
  @Column('decimal')
  pointsAgainstByNumberOfGames: number;

  @Field()
  @Column('decimal')
  pointDiffByNumberOfGames: number;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(levelTeamStanding: Partial<LevelTeamStanding>) {
    Object.assign(this, levelTeamStanding);
  }
}
