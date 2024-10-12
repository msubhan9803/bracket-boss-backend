import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Court } from '../entities/court.entity';

@ObjectType()
export class CourtListResponse {
  @Field(() => [Court])
  courts: Court[];

  @Field(() => Int)
  totalRecords: number;
}
