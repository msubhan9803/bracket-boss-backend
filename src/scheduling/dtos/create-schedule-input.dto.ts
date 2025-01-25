import { InputType, Field } from '@nestjs/graphql';
import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';

@InputType()
export class TeamInput {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => [Number])
  @IsArray({ each: true })
  userIds: number[];
}

@InputType()
export class MatchInput {
  @Field(() => Date)
  @IsDate()
  matchDate?: Date;

  @Field(() => [TeamInput])
  @IsArray({ each: true })
  teams: TeamInput[];
}

@InputType()
export class CreateScheduleInputDto {
  @Field()
  @IsNumber({}, { message: 'Club is required' })
  clubId: number;

  @Field()
  @IsNumber({}, { message: 'Tournament is required' })
  tournamentId: number;

  @Field(() => [MatchInput])
  @IsArray()
  matches: MatchInput[];
}
