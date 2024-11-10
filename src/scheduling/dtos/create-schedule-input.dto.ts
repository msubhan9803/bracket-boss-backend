import { InputType, Field } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class CreateScheduleInputDto {
  @Field()
  @IsNumber({}, { message: 'Tournament is required' })
  tournamentId: number;
}
