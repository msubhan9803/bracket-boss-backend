import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SplitSwitchGroupByEnum } from 'src/scheduling/types/common';

@InputType()
export class LevelInput {
  @Field()
  @IsString({ message: 'Level name is required' })
  name: string;

  @Field()
  @IsInt({ message: 'Level format is required' })
  formatId: number;
}

@InputType()
export class CreateTournamentInputDto {
  @Field()
  @IsString({ message: 'Name is required' })
  name: string;

  @Field()
  @IsString({ message: 'Description is required' })
  description: string;

  @Field()
  @IsDate({ message: 'Start date is required' })
  start_date: Date;

  @Field()
  @IsDate({ message: 'End date is required' })
  end_date: Date;

  @Field()
  @IsBoolean({ message: 'isPrivate must be a boolean value' })
  isPrivate: boolean;

  @Field()
  @IsInt({ message: 'Team Generation Type is required' })
  teamGenerationTypeId: number;

  @Field(() => SplitSwitchGroupByEnum, { nullable: true })
  @IsOptional()
  @IsString()
  splitSwitchGroupBy?: SplitSwitchGroupByEnum;

  @Field()
  @IsInt({ message: 'Best of Rounds must be an integer' })
  matchBestOfRounds: number;

  @Field()
  @IsInt({ message: 'Number of Pools must be an integer' })
  numberOfPools: number;

  @Field(() => [LevelInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LevelInput)
  levels: LevelInput[];
}
