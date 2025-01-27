import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Club } from 'src/clubs/entities/club.entity';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { Court } from 'src/court-management/entities/court.entity';
import { TournamentRound } from 'src/tournament-management/entities/tournamentRound.entity';
import { Team } from 'src/team-management/entities/team.entity';
import { MatchStatus } from './matchStatus.entity';
import { MatchRound } from './matchRound.entity';
import { CourtSchedule } from 'src/court-management/entities/court-schedule.entity';

@ObjectType()
@Entity()
export class Match {
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

  @Field(() => [Court])
  @ManyToMany(() => Court, (court) => court.matches)
  @JoinTable({ name: 'match_courts' })
  courts: Court[];

  @Field(() => [CourtSchedule])
  @ManyToMany(() => CourtSchedule)
  @JoinTable({ name: 'match_court_schedules' })
  courtSchedules: CourtSchedule[];

  @Field(() => [MatchRound])
  @OneToMany(() => MatchRound, (matchRound) => matchRound.match, {
    cascade: true,
    onDelete: "CASCADE",
  })
  matchRounds: MatchRound[];

  @Field()
  @CreateDateColumn()
  matchDate: Date;

  @Field(() => TournamentRound)
  @ManyToOne(() => TournamentRound, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  tournamentRound: TournamentRound;

  @Field(() => Team)
  @ManyToOne(() => Team)
  @JoinColumn()
  homeTeam: Team;

  @Field(() => Team)
  @ManyToOne(() => Team)
  @JoinColumn()
  awayTeam: Team;

  @Field(() => Team, { nullable: true })
  @ManyToOne(() => Team, { nullable: true })
  @JoinColumn()
  winnerTeam?: Team;

  @Field(() => [MatchStatus])
  @ManyToMany(() => MatchStatus, (matchStatus) => matchStatus.matches, {
    cascade: true,
  })
  @JoinTable({ name: 'match_match_statuses' })
  statuses: MatchStatus[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(match: Partial<Match>) {
    Object.assign(this, match);
  }
}
