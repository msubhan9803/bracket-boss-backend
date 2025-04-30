import { ObjectType, Field } from '@nestjs/graphql';
import { Team } from '../entities/team.entity';

@ObjectType()
export class GetAllTeamsByTournamentIdResponse {
  @Field(() => [Team])
  teams: Team[];
}
