import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TeamType {
  @Field()
  name: string;

  @Field(() => [Number])
  players: number[];
}

@ObjectType()
export class MatchType {
  @Field()
  name: string;

  @Field(() => [TeamType])
  teams: TeamType[];
}

@ObjectType()
export class GetScheduleOfTournamentResponseDto {
  @Field(() => [MatchType])
  matches: MatchType[];

  @Field(() => [TeamType])
  teams: TeamType[];
}
