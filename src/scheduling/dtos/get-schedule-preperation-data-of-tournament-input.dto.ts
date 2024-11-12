import { IsArray, IsNumber, ArrayMinSize } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetSchedulePreperationDataOfTournamentInput {
  @Field()
  @IsNumber({}, { message: 'Tournament is required' })
  tournamentId: number;

  @Field(() => [Number])
  @IsArray({ message: 'At least 1 user is required' })
  @ArrayMinSize(1, { message: 'At least 1 user is required' })
  users: number[];
}
