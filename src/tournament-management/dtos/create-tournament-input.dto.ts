import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
} from 'class-validator';
import { GroupByEnum } from 'src/scheduling/types/common';

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
  @IsInt({ message: 'Club ID must be an integer' })
  clubId: number;

  @Field()
  @IsInt({ message: 'Format ID must be an integer' })
  formatId: number;

  @Field()
  @IsInt({ message: 'Team Generation Type is required' })
  teamGenerationTypeId: number;

  @Field(() => GroupByEnum, { nullable: true })
  @IsOptional()
  @IsString()
  splitSwitchGroupBy?: GroupByEnum;

  @Field()
  @IsInt({ message: 'Best of Rounds must be an integer' })
  bestOfRounds: number;
}
