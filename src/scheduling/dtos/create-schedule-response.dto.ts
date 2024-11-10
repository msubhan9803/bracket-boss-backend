import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { ScheduleDto } from './schedule.dto';

@ObjectType()
export class CreateScheduleResponseDto {
  @Field()
  schedule: ScheduleDto;
}
