import { Field, ObjectType } from '@nestjs/graphql';
import { CourtSchedule } from 'src/court-management/entities/court-schedule.entity';
import { Match } from 'src/match-management/entities/match.entity';
import { MatchRound } from 'src/match-management/entities/matchRound.entity';
import { Team } from 'src/team-management/entities/team.entity';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { TournamentRound } from 'src/tournament-management/entities/tournamentRound.entity';

@ObjectType()
export class MatchWithCourtDto extends Match {
  @Field(() => CourtSchedule, { nullable: true })
  courtSchedule: CourtSchedule;

  @Field(() => Date, { nullable: true })
  matchDate: Date;
}

@ObjectType()
export class ScheduleDto {
  @Field(() => Tournament)
  tournament: Tournament;

  @Field(() => [TournamentRound])
  tournamentRounds: TournamentRound[];

  @Field(() => [Team])
  teams: Team[];

  @Field(() => [MatchWithCourtDto])
  matches: MatchWithCourtDto[];

  @Field(() => [MatchRound])
  matchRounds: MatchRound[];
}
