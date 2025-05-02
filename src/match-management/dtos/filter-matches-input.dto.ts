import { Field, InputType } from '@nestjs/graphql';
import { MatchStatusTypes } from '../types/common';
import { IsOptional, IsArray, IsNumber, IsDate, IsNotEmpty, IsString } from 'class-validator';

@InputType()
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

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  startTime?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  endTime?: string;

  @Field(() => [Number], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  teams?: number[];
}
