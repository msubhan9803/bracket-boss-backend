import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsInt, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DayName } from 'src/common/types/global';

@InputType()
class ScheduleTimingInputDto {
  @Field(() => Number, { nullable: true })
  @IsOptional()
  id?: number;

  @Field()
  @IsString({ message: 'Start time is required' })
  startTime: string;

  @Field()
  @IsString({ message: 'End time is required' })
  endTime: string;
}

@InputType()
class DailyScheduleInputDto {
  @Field()
  @IsString({ message: 'Day is required' })
  day: DayName;

  @Field(() => [ScheduleTimingInputDto], { defaultValue: [] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleTimingInputDto)
  scheduleTimings: ScheduleTimingInputDto[];
}

@InputType()
export class UpdateCourtInputDto {
  @Field()
  @IsInt({ message: 'Club ID must be an integer' })
  courtId: number;

  @Field({ nullable: true })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString({ message: 'Location must be a string' })
  @IsOptional()
  location?: string;

  @Field({ nullable: true })
  @IsInt({ message: 'Court length must be an integer' })
  @IsOptional()
  courtLength?: number;

  @Field({ nullable: true })
  @IsInt({ message: 'Court width must be an integer' })
  @IsOptional()
  courtWidth?: number;

  @Field(() => [DailyScheduleInputDto], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DailyScheduleInputDto)
  @IsOptional()
  dailySchedule?: DailyScheduleInputDto[];
}
