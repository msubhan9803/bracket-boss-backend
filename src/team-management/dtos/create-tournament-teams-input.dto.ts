import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsArray } from 'class-validator';

@InputType()
export class CreateTournamentTeamsInputDto {
  @Field(() => Int)
  @IsInt({ message: 'Tournament ID must be an integer' })
  tournamentId: number;

  @Field(() => [Number])
  @IsArray()
  users: number[];
}
