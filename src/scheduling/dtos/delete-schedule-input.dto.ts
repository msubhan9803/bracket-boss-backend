import { InputType, Field } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class DeleteScheduleInputDto {
  @Field()
  @IsNumber({}, { message: 'Tournament ID is required' })
  tournamentId: number;
}
