import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class TeamType {
  @Field()
  name: string;

  @Field(() => [User])
  players: User[];
}

@ObjectType()
export class MatchType {
  @Field()
  name: string;

  @Field(() => [TeamType])
  teams: TeamType[];
}

@ObjectType()
export class GetSchedulePreperationDataOfTournamentResponseDto {
  @Field(() => [MatchType])
  matches: MatchType[];

  @Field(() => [TeamType])
  teams: TeamType[];
}
