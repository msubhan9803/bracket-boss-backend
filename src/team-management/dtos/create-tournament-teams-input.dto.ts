import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsInt, IsArray } from 'class-validator';

@InputType()
export class TournamentTeamInput {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => [Number])
  @IsArray({ each: true })
  userIds: number[];
}

@InputType()
export class CreateTournamentTeamsInputDto {
  @Field(() => Int)
  @IsInt({ message: 'Tournament ID must be an integer' })
  tournamentId: number;

  @Field(() => [TournamentTeamInput])
  @IsArray()
  teams: TournamentTeamInput[];
}
