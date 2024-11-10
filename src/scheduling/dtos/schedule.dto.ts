import { Field, ObjectType } from '@nestjs/graphql';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';

@ObjectType()
export class ScheduleDto {
  @Field()
  tournament: Tournament;
}
