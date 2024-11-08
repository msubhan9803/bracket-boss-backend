import { InputType, Field } from '@nestjs/graphql';
import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';

@InputType()
export class CreateScheduleInputDto {
  @Field()
  @IsNumber({}, { message: 'Tournament is required' })
  tournamentId: number;

  @Field()
  @IsNumber({}, { message: 'Round number is required' })
  roundNo: number;

  @Field(() => [[[[Number]]]])
  @IsArray({ message: 'Matches are required' })
  @ArrayMinSize(1, { message: 'At least 1 match is required' })
  matches: number[][][][];
}
