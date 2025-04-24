import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
} from 'class-validator';
import { SplitSwitchGroupByEnum } from 'src/scheduling/types/common';

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
  @IsInt({ message: 'Pool Play Format ID must be an integer' })
  poolPlayFormatId: number;

  @Field()
  @IsInt({ message: 'Play Off Format ID must be an integer' })
  playOffFormatId: number;

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
}
