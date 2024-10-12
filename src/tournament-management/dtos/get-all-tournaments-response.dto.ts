import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Tournament } from '../entities/tournament.entity';

@ObjectType()
export class TournamentListResponse {
  @Field(() => [Tournament])
  tournaments: Tournament[];

  @Field(() => Int)
  totalRecords: number;
}
