import { Field, ObjectType } from '@nestjs/graphql';
import { Match } from 'src/match-management/entities/match.entity';
import { MatchRound } from 'src/match-management/entities/matchRound.entity';
import { Team } from 'src/team-management/entities/team.entity';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { TournamentRound } from 'src/tournament-management/entities/tournamentRound.entity';

@ObjectType()
export class ScheduleDto {
  @Field(() => Tournament)
  tournament: Tournament;

  @Field(() => TournamentRound)
  tournamentRound: TournamentRound;

  @Field(() => [Team])
  teams: Team[];

  @Field(() => [Match])
  matches: Match[];

  @Field(() => [MatchRound])
  matchRounds: MatchRound[];
}
