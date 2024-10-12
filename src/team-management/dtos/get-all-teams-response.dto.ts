import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Team } from '../entities/team.entity';

@ObjectType()
export class TeamListResponse {
  @Field(() => [Team])
  teams: Team[];

  @Field(() => Int)
  totalRecords: number;
}
