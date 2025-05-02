import { ArgsType, Field } from '@nestjs/graphql';
import { MatchStatusTypes } from '../types/common';
import { IsOptional, IsArray, IsNumber, IsDate, IsNotEmpty } from 'class-validator';

@ArgsType()
export class FilterMatchesInputDto {
  @Field(() => Number)
  @IsNumber()
  @IsNotEmpty()
  tournamentId: number;

  @Field(() => [Number], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  levels?: number[];

  @Field(() => [Number], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  pools?: number[];

  @Field(() => [Number], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  rounds?: number[];

  @Field(() => [MatchStatusTypes], { nullable: true })
  @IsOptional()
  @IsArray()
  status?: MatchStatusTypes[];

  @Field(() => [Number], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  courts?: number[];

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  date?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  startTime?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  endTime?: Date;

  @Field(() => [Number], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  teams?: number[];
}
