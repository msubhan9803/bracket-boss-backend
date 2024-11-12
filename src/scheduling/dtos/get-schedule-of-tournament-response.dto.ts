import { Field, ObjectType } from '@nestjs/graphql';
import { ScheduleDto } from './schedule.dto';

@ObjectType()
export class GetScheduleOfTournamentResponseDto {
  @Field(() => ScheduleDto)
  schedule: ScheduleDto;
}
