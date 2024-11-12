import { IsNumber } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetScheduleOfTournamentInput {
  @Field()
  @IsNumber({}, { message: 'Tournament is required' })
  tournamentId: number;
}
