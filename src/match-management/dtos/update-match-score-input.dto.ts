import { InputType, Field } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateMatchScoreInputDto {
  @Field()
  @IsInt({ message: 'Match ID must be an integer' })
  matchId: number;

  @Field()
  @IsInt({ message: 'Round ID must be an integer' })
  roundId: number;

  @Field()
  @IsInt({ message: 'Home team score must be an integer' })
  homeTeamScore: number;

  @Field()
  @IsInt({ message: 'Away team score must be an integer' })
  awayTeamScore: number;
}
