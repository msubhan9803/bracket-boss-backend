import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Team } from 'src/team-management/entities/team.entity';
import { MatchRound } from './matchRound.entity';
import { Club } from 'src/clubs/entities/club.entity';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Entity()
export class MatchRoundScore {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Club)
  @ManyToOne(() => Club)
  @JoinColumn()
  club: Club;

  @Field(() => Tournament)
  @ManyToOne(() => Tournament)
  @JoinColumn()
  tournament: Tournament;

  @Field(() => MatchRound)
  @ManyToOne(() => MatchRound)
  @JoinColumn()
  matchRound: MatchRound;

  @Field(() => Team)
  @ManyToOne(() => Team)
  @JoinColumn()
  team: Team;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn()
  player: User;

  @Field()
  @Column('int')
  score: number;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(matchRoundScore: Partial<MatchRoundScore>) {
    Object.assign(this, matchRoundScore);
  }
}
